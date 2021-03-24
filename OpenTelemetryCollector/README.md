# Setup
**Important**: This project assumes that the following plugins are enabled in Kubernetes:

- dns
- rbac
- storage

If they are not enabled, they can be toggled with (assuming microk8s):

```
sudo microk8s.enable dns rbac storage
```

## Setting up the Jaeger Operator
This deployment relies on the presence of the Jaeger operator. This operator will monitor for the deployment of Jaeger custom resources (`Kind: Jaeger`). For simplicity, this project assumes that the Jaeger operator will run in the namespace `observability` while it manages resources in the application namespace `templateapp`. To create these namespaces and provide Jaeger with the necessary permissions, run:

```
kubectl apply -f namespace.yml
kubectl apply -f jaeger/namespace.yml
kubectl apply -f jaeger/jaeger_role_templateapp.yml
```

Then, to install the Jaeger operator run:

```
kubectl create -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/master/deploy/crds/jaegertracing.io_jaegers_crd.yaml
kubectl create -n observability -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/master/deploy/service_account.yaml
kubectl create -n observability -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/master/deploy/role.yaml
kubectl create -n observability -f https://raw.githubusercontent.com/jaegertracing/jaeger-operator/master/deploy/role_binding.yaml
```

As well as running the custom operator found locally:

```
kubectl create -f jaeger/operator.yml
```

All resources of `Kind: Jaeger` should now be added to the namespace `templateapp`.

## Configuring Elasticsearch for storage
First, we must install the Elastic Operator similar to the Jaeger Operator:

```
kubectl apply -f https://download.elastic.co/downloads/eck/1.4.0/all-in-one.yaml
```

Then run the following command to configure an Elasticsearch cluster with a single node:

```
kubectl apply -f elastic/config.yml
```

If the cluster does not have sufficient resources to run Elasticsearch locally, you can povision a free instance at AWS.

## Deploying Jaeger tracing
Now, we can use the Jaeger Operator to provision Jaeger inside our cluster. The configuration for the entire Jaeger deployment can be applied with:

```
kubectl apply -f jaeger/config.yml
```

For a vendor agnostic solution, a DaemonSet is used to deploy a separate Core OTEL collector on each node in the cluster. Applications can be instrumented to forward trace data to this agent on their host node. The OTEL collector then transforms the data into a format understood by Jaeger, and forwards it to the Jaeger collector. The Core OTEL DaemonSet can be applied with:

```
kubectl apply -f otel/agent.yml
```






For a vendor agnostic solution, the application will be instrumented with the Core OTEL collector, which is configured to forward trace data to the load-balanced Jaeger collector in the cluster. The Jaeger backend could thus easily be swapped out with another solution.

## Deploying the template app
The template application is a microservice app with a front-end server and two backend services. Each service is dpeloyed with a Jaeger OTEL agent as sidecar. As such, OpenTelemetry instrumentation can forward traces to `localhost:55680`. They can be deployed by running:

```
kubectl apply -f server/deployment.yml
kubectl apply -f service_hello/deployment.yml
kubectl apply -f service_info/deployment.yml
```

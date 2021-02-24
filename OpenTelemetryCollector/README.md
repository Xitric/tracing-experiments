# Setup
**Important**: This project assumes that the following plugins are enabled in Kubernetes:

- dns
- rbac
- storage

If they are not enabled, the can be toggled with:

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

## Deploying the template app
The template application is a microservice app with a front-end server and two backend services. Each service is dpeloyed with a Jaeger OTEL agent as sidecar. As such, OpenTelemetry instrumentation can forward traces to `localhost:55680`. They can be deployed by running:

```
kubectl apply -f server/deployment.yml
kubectl apply -f service_hello/deployment.yml
kubectl apply -f service_info/deployment.yml
```

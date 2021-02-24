# Setup
## Setting up the Jaeger Operator
This deployment relies on the presence of the Jaeger operator to automatically manage instrumentation of pods with collector agent sidecars. This operator will monitor for the deployment of Jaeger custom resources (`Kind: Jaeger`). For simplicity, this project assumes that the Jaeger operator will run in the namespace `observability` while it manages resources in the application namespace `templateapp`. To create these namespaces and provide Jaeger with the necessary permissions, run:

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
kubectl create -n observability -f jaeger/operator.yml
```

## Deploying the template app
The template application is a microservice app with a front-end server and two backend services. They can be deployed by running:

```
kubectl apply -f server/deployment.yml
kubectl apply -f service_hello/deployment.yml
kubectl apply -f service_info/deployment.yml
```

# Cloud Vault — DevOps Microservices Project

> **Cloud Vault** is a DevOps-focused microservices project designed to demonstrate how a modern application can be developed, containerized, monitored, and deployed using **Docker, Docker Compose, Kubernetes, Minikube, NGINX Ingress, Helm, Prometheus, and Grafana**.

The application follows a microservices architecture with a dedicated API Gateway, User Service, and Vault Service. Authentication is handled through Google OAuth, application data is stored in MongoDB, and Cloudinary is used for cloud-based file/image storage.

---

## 📌 Project Overview

Cloud Vault is built to demonstrate the complete DevOps lifecycle:

```text
Developer
   │
   ▼
GitHub
   │
   ▼
Docker Build
   │
   ├── Frontend
   ├── Gateway
   ├── User Service
   └── Vault Service
   │
   ▼
Docker Hub
   │
   ▼
Kubernetes / Minikube
   │
   ├── Frontend
   ├── Gateway
   ├── User Service
   ├── Vault Service
   ├── MongoDB
   └── Ingress
   │
   ▼
Prometheus
   │
   ▼
Grafana
```

### Main goals

- Build a real microservices-based application.
- Containerize every application component.
- Use Docker Compose for local development and testing.
- Push application images to Docker Hub.
- Deploy the application to Kubernetes.
- Use Minikube for local Kubernetes deployment.
- Expose the application through Kubernetes Ingress.
- Store sensitive configuration using Kubernetes Secrets.
- Monitor the application with Prometheus and Grafana.
- Demonstrate practical DevOps deployment and monitoring workflows.

---

# 🏗️ Architecture

```text
                         ┌────────────────────┐
                         │      Browser       │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │     Frontend       │
                         │   React + Vite     │
                         │      NGINX         │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │      Gateway       │
                         │     Port 8000      │
                         │  API Proxy / JWT   │
                         └─────────┬──────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │   User Service   │          │   Vault Service  │
          │    Port 5001     │          │    Port 5002     │
          │ Google OAuth/JWT │          │ Vault Operations  │
          └────────┬─────────┘          └────────┬─────────┘
                   │                             │
                   └──────────────┬──────────────┘
                                  ▼
                         ┌──────────────────┐
                         │     MongoDB      │
                         │      Port 27017  │
                         └──────────────────┘

                         Vault Service
                               │
                               ▼
                         ┌──────────────┐
                         │  Cloudinary  │
                         └──────────────┘
```

---

# 🧩 Microservices

| Service | Port | Responsibility |
|---|---:|---|
| Frontend | 80 | React/Vite application served through NGINX |
| Gateway | 8000 | API Gateway, routing and authentication middleware |
| User Service | 5001 | User management and Google OAuth authentication |
| Vault Service | 5002 | Vault/application operations and Cloudinary integration |
| MongoDB | 27017 | Persistent application database |

---

# 🛠️ Technology Stack

### Application

- React
- Vite
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- Google OAuth
- JWT
- Cloudinary

### DevOps

- Docker
- Docker Compose
- Docker Hub
- Kubernetes
- Minikube
- NGINX Ingress
- Helm
- Prometheus
- Grafana

---

# 📁 Expected Project Structure

```text
cloud-vault/
│
├── frontend/
│   ├── Dockerfile
│   └── ...
│
├── gateway/
│   ├── Dockerfile
│   └── ...
│
├── user-service/
│   ├── Dockerfile
│   └── ...
│
├── vault-service/
│   ├── Dockerfile
│   └── ...
│
├── k8s/
│   ├── frontend/
│   ├── gateway/
│   ├── ingress/
│   ├── mongodb/
│   ├── monitoring/
│   ├── secrets/
│   ├── user-service/
│   └── vault-service/
│
├── monitoring/
│   └── values.yml
│
├── secrets/
│   ├── access_token_secret.txt
│   ├── access_token_expiry.txt
│   ├── refresh_token_secret.txt
│   ├── refresh_token_expiry.txt
│   ├── google_client_id.txt
│   ├── google_client_secret.txt
│   ├── cloudinary_cloud_name.txt
│   ├── cloudinary_api_key.txt
│   ├── cloudinary_api_secret.txt
│   └── mongodb_uri.txt
│
└── docker-compose.yml
│
└── docker-compose-k8s.yml

```

---

# 🚀 Part 1 — Run the Project Using Docker Compose

Docker Compose is used first to verify that the complete application works without Kubernetes.

## 1. Prerequisites

Install:

- Docker
- Docker Compose
- Git

Verify Docker:

```bash
docker --version
docker compose version
```

---

# 2. Create the Secrets Directory

From the project root:

```bash
mkdir -p secrets
```

Create the required files:

```bash
touch secrets/access_token_secret.txt
touch secrets/access_token_expiry.txt
touch secrets/refresh_token_secret.txt
touch secrets/refresh_token_expiry.txt
touch secrets/google_client_id.txt
touch secrets/google_client_secret.txt
touch secrets/cloudinary_cloud_name.txt
touch secrets/cloudinary_api_key.txt
touch secrets/cloudinary_api_secret.txt
touch secrets/mongodb_uri.txt
```

Your directory should look like:

```text
secrets/
├── access_token_secret.txt
├── access_token_expiry.txt
├── refresh_token_secret.txt
├── refresh_token_expiry.txt
├── google_client_id.txt
├── google_client_secret.txt
├── cloudinary_cloud_name.txt
├── cloudinary_api_key.txt
├── cloudinary_api_secret.txt
└── mongodb_uri.txt
```

---

# 3. Add Secret Values

Put the corresponding value into each file.

Example:

```text
secrets/access_token_secret.txt
```

contains:

```text
your-access-token-secret
```

For Google OAuth:

```text
secrets/google_client_id.txt
```

contains your Google OAuth Client ID.

```text
secrets/google_client_secret.txt
```

contains your Google OAuth Client Secret.

For Cloudinary:

```text
secrets/cloudinary_cloud_name.txt
secrets/cloudinary_api_key.txt
secrets/cloudinary_api_secret.txt
```

contain your Cloudinary credentials.

For MongoDB:

```text
secrets/mongodb_uri.txt
```

contains your MongoDB connection URI.

Example:

```gitignore
secrets/
```

---

# 4. Google OAuth Configuration

Create/configure your Google OAuth application and use your own Google Client ID.

The frontend receives the Client ID during the Docker image build:

```yaml
args:
  - VITE_API_URL=http://localhost:8000/api/v1
  - VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Replace:

```text
YOUR_GOOGLE_CLIENT_ID
```

with your own Google OAuth Client ID.

Make sure the required authorized origins/redirect configuration matches the environment in which you are testing the application.

---

# 5. Build and Start the Application

From the project root:

```bash
docker compose build
```

Then start all services:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

You should see:

```text
vault-frontend
gateway
user_service
vault_service
mongo
```

---

# 7. Check Container Logs

Gateway:

```bash
docker compose logs -f gateway
```

User Service:

```bash
docker compose logs -f user-service
```

Vault Service:

```bash
docker compose logs -f vault-service
```

Frontend:

```bash
docker compose logs -f frontend
```

All services:

```bash
docker compose logs -f
```

---

# 8. Access the Application

Frontend:

```text
http://localhost
```

Gateway:

```text
http://localhost:8000
```

The frontend communicates with the gateway through:

```text
http://localhost:8000/api/v1
```

---

# 8. Stop Docker Compose

```bash
docker compose down
```

To remove the MongoDB volume as well:

```bash
docker compose down -v
```

> Be careful with `-v` because it removes the persistent MongoDB Docker volume.

---

# 🐳 Part 2 — Push Docker Images to Docker Hub

The Kubernetes deployment uses images stored in Docker Hub.

Before pushing, log in:

```bash
docker login
```

---

## 1. Docker Compose Configuration for Docker Hub

The image configuration is: docker-compose-k8s.yml

Replace in docker-compose-k8s.yml in frontend service:

```text
YOUR_GOOGLE_CLIENT_ID
```

with your Google OAuth Client ID.

---

## 2. Build the Images

```bash
docker compose -f docker-compose-k8s.yml build
```

Check images:

```bash
docker images
```

You should have images similar to:

```text
vinitparmar03/cloudvault-frontend:05
vinitparmar03/cloudvault-gateway:07
vinitparmar03/cloudvault-user-service:06
vinitparmar03/cloudvault-vault-service:08
```

---

## 3. Push All Images

Run:

```bash
docker compose -f docker-compose-k8s.yml push
```

Or push individually:

```bash
docker push vinitparmar03/cloudvault-frontend:05
docker push vinitparmar03/cloudvault-gateway:07
docker push vinitparmar03/cloudvault-user-service:06
docker push vinitparmar03/cloudvault-vault-service:08
```

Verify the images in your Docker Hub repositories.

---

# ☸️ Part 3 — Kubernetes Deployment

After verifying the application with Docker Compose and pushing the images to Docker Hub, deploy the application using Kubernetes.

The Kubernetes deployment uses:

- Minikube
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes Secrets
- NGINX Ingress
- MongoDB
- Prometheus
- Grafana
- Helm

---

# 1. Install/Verify Minikube

Verify:

```bash
minikube version
```

Start Minikube:

```bash
minikube start
```

Check:

```bash
minikube status
```

---

# 2. Enable the Ingress Addon

Enable NGINX Ingress:

```bash
minikube addons enable ingress
```

Verify:

```bash
minikube addons list
```

The ingress addon should show as enabled.

---

# 3. Configure the Local Domain

The Kubernetes application uses:

```text
vault.local.com
```

The frontend Docker build is configured with:

```text
VITE_API_URL=http://vault.local.com/api/v1
```

You need to point the local domain to Minikube.

Find the Minikube IP:

```bash
minikube ip
```

Then add an entry to your hosts file.

Linux:

```bash
sudo nano /etc/hosts
```

Add:

```text
<MINIKUBE_IP> vault.local.com
```

For example:

```text
192.168.49.2 vault.local.com
```

Use the IP returned by your own `minikube ip` command.

---

# 🔐 Part 4 — Kubernetes Secrets

The Kubernetes deployment requires several sensitive credentials, including JWT secrets, Google OAuth credentials, MongoDB credentials, and Cloudinary credentials.

All Kubernetes Secret manifests are located in:

```text
k8s/secrets/
```

**Change the Secret manifests according to your own credentials and configuration before deploying the application.**

The project requires credentials for:

* Access Token Secret
* Access Token Expiry
* Refresh Token Secret
* Refresh Token Expiry
* Google Client ID
* Google Client Secret
* MongoDB URI
* Cloudinary Cloud Name
* Cloudinary API Key
* Cloudinary API Secret

---

## 🔑 JWT Secrets

Configure the following values in the appropriate Kubernetes Secret manifest:

```text
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY
```

Use your own secure values for the access and refresh token secrets.

---

## 🔵 Google Secrets

Configure your Google OAuth credentials in the appropriate Kubernetes Secret manifest.

Use your own:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

You can obtain these credentials from your Google Cloud project.

Make sure your Google OAuth configuration is correctly configured for the domain you are using for the Kubernetes deployment.

---

## ☁️ Cloudinary Secrets

The Vault Service uses Cloudinary for cloud-based file and image storage.

Configure:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Use the credentials from your own Cloudinary account.

---

## 🍃 MongoDB

Configure the MongoDB connection URI in the appropriate Kubernetes Secret manifest.

Use:

```text
MONGODB_URI
```

If MongoDB is running inside the Kubernetes cluster, make sure the connection string uses the correct MongoDB Kubernetes Service name.

For example:

```text
mongodb://mongodb:27017/cloudvault
```

Use the actual MongoDB Service name defined in:

```text
k8s/mongodb/
```

---

## 🚀 Apply Kubernetes Secrets

After configuring the Secret manifests, apply them to the Kubernetes cluster:

```bash
kubectl apply -f k8s/secrets
```

Verify that the Secrets have been created:

```bash
kubectl get secrets
```

You can inspect a specific Secret using:

```bash
kubectl describe secret <secret-name>
```

> `kubectl describe secret` does not display the actual secret values.

---

# ⚠️ Secret Security

**Do not upload real credentials to GitHub.**

Never commit your actual:

* Google Client Secret
* JWT secrets
* MongoDB credentials
* Cloudinary API Secret
* Other sensitive credentials

If your project contains local secret files, add them to `.gitignore`.

For example:

```gitignore
secrets/
*.secret.yaml
*.secret.yml
```

> **Important:** If your Kubernetes YAML files contain values encoded using Base64, remember that **Base64 encoding is not encryption**.

For a real production environment, use a dedicated secret-management solution such as:

* AWS Secrets Manager
* AWS Systems Manager Parameter Store
* HashiCorp Vault
* External Secrets Operator
* Another secure cloud secret-management solution

For this project, Kubernetes Secrets are used to keep sensitive configuration separate from the application Deployment manifests.

---

# 📊 Part 5 — Install Prometheus and Grafana

Monitoring is installed using Helm.

Before deploying the application monitoring stack, add the Prometheus Community repository:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

Update Helm repositories:

```bash
helm repo update
```

Verify:

```bash
helm repo list
```

---

# 1. Create Monitoring Namespace

```bash
kubectl create namespace monitoring
```

If the namespace already exists, Kubernetes will report that it already exists.

---

# 2. Install kube-prometheus-stack

Install Prometheus and Grafana using the project's custom values:

```bash
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f monitoring/values.yml
```

The `monitoring/values.yml` file contains the project's monitoring configuration.

Check Helm:

```bash
helm list -n monitoring
```

---

# 3. Check Monitoring Pods

```bash
kubectl get pods -n monitoring
```

You should see components such as:

```text
prometheus
grafana
alertmanager
node-exporter
kube-state-metrics
```

The exact pod names depend on the Helm chart version.

---

# ☸️ Part 6 — Deploy Kubernetes Resources

After Minikube, Ingress, Secrets, and monitoring are configured, deploy the application resources.

From the project root:

```bash
kubectl apply -f k8s/secrets
```

Then MongoDB:

```bash
kubectl apply -f k8s/mongodb
```

Deploy User Service:

```bash
kubectl apply -f k8s/user-service
```

Deploy Vault Service:

```bash
kubectl apply -f k8s/vault-service
```

Deploy Gateway:

```bash
kubectl apply -f k8s/gateway
```

Deploy Frontend:

```bash
kubectl apply -f k8s/frontend
```

Deploy Ingress:

```bash
kubectl apply -f k8s/ingress
```

Deploy application monitoring resources:

```bash
kubectl apply -f k8s/monitoring
```

---

# 🚀 Complete Kubernetes Deployment Sequence

The complete sequence is:

```bash
minikube start

minikube addons enable ingress

minikube ip
```

Configure:

```text
/etc/hosts
```

with:

```text
<MINIKUBE_IP> vault.local.com
```

Then install monitoring:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

kubectl create namespace monitoring

helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f monitoring/values.yml
```

Then deploy the application:

```bash
kubectl apply -f k8s/secrets

kubectl apply -f k8s/mongodb

kubectl apply -f k8s/user-service

kubectl apply -f k8s/vault-service

kubectl apply -f k8s/gateway

kubectl apply -f k8s/frontend

kubectl apply -f k8s/ingress

kubectl apply -f k8s/monitoring
```

---

# 🔍 Part 7 — Verify Kubernetes Deployment

Check all pods:

```bash
kubectl get pods
```

Check services:

```bash
kubectl get services
```

Check deployments:

```bash
kubectl get deployments
```

Check ingress:

```bash
kubectl get ingress
```

Check everything:

```bash
kubectl get all
```

---

# 🧪 Check Individual Components

Frontend:

```bash
kubectl get pods -l app=frontend
```

Gateway:

```bash
kubectl get pods -l app=gateway
```

User Service:

```bash
kubectl get pods -l app=user-service
```

Vault Service:

```bash
kubectl get pods -l app=vault-service
```

MongoDB:

```bash
kubectl get pods -l app=mongodb
```

---

# 📜 Kubernetes Logs

Gateway:

```bash
kubectl logs deployment/gateway
```

User Service:

```bash
kubectl logs deployment/user-service
```

Vault Service:

```bash
kubectl logs deployment/vault-service
```

Frontend:

```bash
kubectl logs deployment/frontend
```

For a specific pod:

```bash
kubectl logs <pod-name>
```

---

# 🌐 Access Cloud Vault

After the Ingress configuration is active, open:

```text
http://vault.local.com
```

The request flow becomes:

```text
Browser
   │
   ▼
vault.local.com
   │
   ▼
NGINX Ingress
   │
   ▼
Frontend / Gateway
   │
   ▼
Microservices
```

---

## 📈 Part 8 — Prometheus and Grafana

This project uses **Prometheus** for collecting application and Kubernetes metrics and **Grafana** for visualizing those metrics through dashboards.

The monitoring stack is configured through:

```text
monitoring/values.yml
```

The `values.yml` file contains the configuration for:

* Grafana
* Prometheus
* NGINX Ingress
* Grafana hostname
* Prometheus hostname
* ServiceMonitor selection

> **Note:** The configuration is already provided in `monitoring/values.yml`. You do not need to add the configuration directly to this README. Make sure the file is present before installing the monitoring stack.

---

## 🌐 Grafana

Grafana is configured to use the hostname:

```text
grafana.local.com
```

Because Grafana is exposed through the Kubernetes NGINX Ingress, make sure the hostname points to your Minikube IP.

First, get the Minikube IP:

```bash
minikube ip
```

Then add the following entry to your `/etc/hosts` file:

```text
<MINIKUBE_IP> grafana.local.com
```

For example:

```text
192.168.49.2 grafana.local.com
```

Use the IP returned by your own `minikube ip` command.

You can then access Grafana at:

```text
http://grafana.local.com
```

The Grafana credentials are configured in:

```text
monitoring/values.yml
```

Use the username and password configured there when logging in.

---

## 📊 Prometheus

Prometheus is configured to use the hostname:

```text
prometheus.local.com
```

Add the hostname to `/etc/hosts`:

```text
<MINIKUBE_IP> prometheus.local.com
```

For example:

```text
192.168.49.2 prometheus.local.com
```

You can then access Prometheus at:

```text
http://prometheus.local.com
```

---

## 🔎 Verify Prometheus Targets

After deploying the application and monitoring resources, open:

```text
http://prometheus.local.com
```

Navigate to:

```text
Status → Target health
```

Prometheus should display the targets that it has discovered.

Check that the application metrics endpoint is being scraped successfully.

If a target is not available, check:

```bash
kubectl get servicemonitor
```

and:

```bash
kubectl get endpoints
```

You can also inspect the application Pod logs:

```bash
kubectl logs <pod-name>
```

---

## 📈 Metrics That Can Be Monitored

The monitoring stack can be used to observe:

* CPU usage
* Memory usage
* Kubernetes Pod health
* Container metrics
* Request metrics
* Application performance
* Service availability
* Kubernetes resource usage
* Node metrics
* Application-specific Prometheus metrics

---

## 🧪 Useful Monitoring Commands

Check all monitoring resources:

```bash
kubectl get all -n monitoring
```

Check Prometheus:

```bash
kubectl get pods -n monitoring | grep prometheus
```

Check Grafana:

```bash
kubectl get pods -n monitoring | grep grafana
```

Check ServiceMonitors:

```bash
kubectl get servicemonitor -A
```

Check Ingress resources:

```bash
kubectl get ingress -A
```

Check monitoring events:

```bash
kubectl get events -n monitoring
```

---

# ⚠️ Troubleshooting

### Grafana is not opening

Check:

```bash
kubectl get ingress -n monitoring
```

Then verify the Ingress controller:

```bash
kubectl get pods -n ingress-nginx
```

Also verify:

```bash
cat /etc/hosts
```

Make sure it contains:

```text
<MINIKUBE_IP> grafana.local.com
```

---

### Prometheus is not opening

Check:

```bash
kubectl get ingress -n monitoring
```

Verify the hostname:

```text
prometheus.local.com
```

and make sure `/etc/hosts` contains:

```text
<MINIKUBE_IP> prometheus.local.com
```

---

### Application metrics are not appearing

Check the ServiceMonitor:

```bash
kubectl get servicemonitor -A
```

Check the application Service:

```bash
kubectl get svc
```

Check the application endpoints:

```bash
kubectl get endpoints
```

Then check Prometheus:

```text
Status → Target health
```

A target should show as **UP** when Prometheus is successfully scraping the application metrics endpoint.

---

# 🔄 Part 9 — Updating Docker Images

When application code changes:

### 1. Update the image tag

Example:

```yaml
image: vinitparmar03/cloudvault-frontend:06
```

### 2. Build

```bash
docker compose -f docker-compose-k8s.yml build
```

### 3. Push

```bash
docker compose -f docker-compose-k8s.yml push
```

### 4. Update Kubernetes deployment

Update the image tag in the Kubernetes Deployment manifest.

Then:

```bash
kubectl apply -f k8s/frontend
```

Or restart the deployment:

```bash
kubectl rollout restart deployment/frontend
```

Check rollout:

```bash
kubectl rollout status deployment/frontend
```

---

# 🩺 Troubleshooting

## Check all pods

```bash
kubectl get pods -A
```

If a pod is failing:

```bash
kubectl describe pod <pod-name>
```

Check logs:

```bash
kubectl logs <pod-name>
```

---

## ImagePullBackOff

Check:

```bash
kubectl describe pod <pod-name>
```

Verify that:

- Docker Hub image exists.
- Image tag is correct.
- Repository is public or Kubernetes has appropriate registry credentials.

---

## CrashLoopBackOff

Check:

```bash
kubectl logs <pod-name>
```

Then inspect:

```bash
kubectl describe pod <pod-name>
```

Common causes include:

- Missing environment variables
- Incorrect secrets
- Incorrect MongoDB URI
- Invalid Google OAuth configuration
- Incorrect service hostname
- Application startup errors

---

## Ingress Not Working

Check:

```bash
kubectl get ingress
```

Check the Ingress controller:

```bash
kubectl get pods -n ingress-nginx
```

Check Minikube:

```bash
minikube status
```

Verify `/etc/hosts`:

```bash
cat /etc/hosts
```

You should have:

```text
<MINIKUBE_IP> vault.local.com
```

---

## Service Connectivity

Inside Kubernetes, services communicate using Kubernetes DNS names.

For example:

```text
user-service:5001
```

and:

```text
vault-service:5002
```

The Gateway should communicate with:

```text
http://user-service:5001
```

and:

```text
http://vault-service:5002
```

Do not use `localhost` for communication between separate Kubernetes pods.

---

# 🧹 Remove the Kubernetes Deployment

Delete the application resources:

```bash
kubectl delete -f k8s/frontend
kubectl delete -f k8s/gateway
kubectl delete -f k8s/ingress
kubectl delete -f k8s/mongodb
kubectl delete -f k8s/monitoring
kubectl delete -f k8s/secrets
kubectl delete -f k8s/user-service
kubectl delete -f k8s/vault-service
```

Remove the monitoring stack:

```bash
helm uninstall kube-prometheus-stack -n monitoring
```

Delete the monitoring namespace:

```bash
kubectl delete namespace monitoring
```

Stop Minikube:

```bash
minikube stop
```

---

# 🔐 Security Considerations

This project demonstrates several security practices:

- JWT-based authentication
- Access and refresh token separation
- Google OAuth authentication
- Docker secrets for local Docker Compose deployment
- Kubernetes Secrets for Kubernetes deployment
- Sensitive credentials kept outside application source code
- Service-to-service communication through internal service names

---

# 🎯 DevOps Concepts Demonstrated

This project is primarily a **DevOps portfolio project** rather than only a web-development project.

It demonstrates:

### Containerization

```text
Application
     ↓
Dockerfile
     ↓
Docker Image
     ↓
Docker Container
```

### Container Orchestration

```text
Docker Containers
       ↓
Kubernetes
       ↓
Pods
       ↓
Deployments
       ↓
Services
```

### Service Discovery

Kubernetes DNS allows services to communicate using names such as:

```text
user-service:5001
vault-service:5002
```

### Ingress

Ingress provides an entry point to the application:

```text
vault.local.com
       ↓
NGINX Ingress
       ↓
Application Services
```

### Monitoring

```text
Kubernetes
    ↓
Prometheus
    ↓
Grafana
    ↓
Dashboards
```

---

# 📚 What I Learned From This Project

Through Cloud Vault, the following practical DevOps concepts are demonstrated:

- Microservices architecture
- Docker image creation
- Docker Compose
- Docker networking
- Docker volumes
- Docker secrets
- Docker Hub
- Kubernetes Deployments
- Kubernetes Services
- Kubernetes Secrets
- Kubernetes persistent storage
- Kubernetes Ingress
- Minikube
- Helm
- Prometheus
- Grafana
- Application monitoring
- Container troubleshooting
- Kubernetes troubleshooting
- Service-to-service communication
- Environment-specific configuration

---

# 👨‍💻 About the Developer

## Vinit Parmar

**Cloud / DevOps Engineer**

I am building Cloud Vault as a practical DevOps project to strengthen my understanding of:

- Cloud Engineering
- DevOps
- Containerization
- Kubernetes
- Monitoring
- Microservices

### Contact

**Email:** `vinitparmar03@gmail.com`

**LinkedIn:** `https://www.linkedin.com/in/vinit-kumar-parmar-22522a215/`

---

# ⭐ Project Highlights

```text
✓ Microservices Architecture
✓ React + Node.js Application
✓ API Gateway
✓ Google OAuth
✓ JWT Authentication
✓ MongoDB
✓ Cloudinary
✓ Docker
✓ Docker Compose
✓ Docker Hub
✓ Kubernetes
✓ Minikube
✓ NGINX Ingress
✓ Helm
✓ Prometheus
✓ Grafana
✓ Kubernetes Monitoring
✓ Secrets Management
```

---

# 🏁 Final Deployment Flow

The complete project workflow is:

```text
1. Develop Microservices
          ↓
2. Test Application Locally
          ↓
3. Dockerize Services
          ↓
4. Run With Docker Compose
          ↓
5. Verify Application
          ↓
6. Build Docker Images
          ↓
7. Push Images to Docker Hub
          ↓
8. Start Minikube
          ↓
9. Enable NGINX Ingress
          ↓
10. Configure Kubernetes Secrets
          ↓
11. Install Prometheus + Grafana Using Helm
          ↓
12. Deploy MongoDB
          ↓
13. Deploy User Service
          ↓
14. Deploy Vault Service
          ↓
15. Deploy Gateway
          ↓
16. Deploy Frontend
          ↓
17. Deploy Ingress
          ↓
18. Deploy Monitoring Resources
          ↓
19. Verify Pods / Services / Ingress
          ↓
20. Access Cloud Vault
          ↓
21. Monitor Application Using Prometheus + Grafana
```

---


## License

This project is created for learning, portfolio development, and demonstrating practical DevOps and cloud engineering concepts.
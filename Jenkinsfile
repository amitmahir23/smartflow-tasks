pipeline {
    agent any

    environment {
        IMAGE_NAME_FRONTEND = 'mahir123456/mern-frontend'
        IMAGE_NAME_BACKEND = 'mahir123456/mern-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker: Build Images') {
            steps {
                // The Dockerfiles already handle 'npm install' and 'npm run build'
                // via multi-stage builds. We only need to run the build command.
                sh "docker build -t ${IMAGE_NAME_FRONTEND}:${BUILD_NUMBER} ."
                sh "docker build -t ${IMAGE_NAME_BACKEND}:${BUILD_NUMBER} ./backend"
            }
        }

        stage('Deploy with Ansible') {
            steps {
                sh '''
                # Dynamically update Kubernetes YAML files to use the newly built image version
                sed -i "s|image: mahir123456/mern-frontend:.*|image: ${IMAGE_NAME_FRONTEND}:${BUILD_NUMBER}|g" k8s/frontend-deployment.yaml
                sed -i "s|image: mahir123456/mern-backend:.*|image: ${IMAGE_NAME_BACKEND}:${BUILD_NUMBER}|g" k8s/backend-deployment.yaml

                # Safely copy Windows kubeconfig and route through Docker Desktop networking
                cp /var/jenkins_home/.kube/config /tmp/kubeconfig || true
                sed -i 's/127.0.0.1/host.docker.internal/g' /tmp/kubeconfig || true
                sed -i '/certificate-authority-data/d' /tmp/kubeconfig || true
                sed -i 's/server: https:\\/\\/host.docker.internal.*/&\\n    insecure-skip-tls-verify: true/g' /tmp/kubeconfig || true
                export KUBECONFIG=/tmp/kubeconfig

                ansible-playbook ansible/deploy-k8s.yml
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'MERN Stack Build successful!'
        }
        failure {
            echo 'Build failed. Please check the logs.'
        }
    }
}

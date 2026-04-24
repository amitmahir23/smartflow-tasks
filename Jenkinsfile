pipeline {
    agent any

    environment {
        IMAGE_NAME_FRONTEND = 'smartflow-frontend'
        IMAGE_NAME_BACKEND = 'smartflow-backend'
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
                # Safely copy Windows kubeconfig and route through Docker Desktop networking
                cp /var/jenkins_home/.kube/config /tmp/kubeconfig || true
                sed -i 's/127.0.0.1/host.docker.internal/g' /tmp/kubeconfig || true
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

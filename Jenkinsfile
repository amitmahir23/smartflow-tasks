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

        stage('Frontend: Install & Build') {
            steps {
                // High-compatibility quoting for nested shell commands
                sh "docker run --rm -v \$(pwd):/app -w /app node:20-alpine sh -c 'npm install && npm run build'"
            }
        }

        stage('Backend: Install') {
            steps {
                sh "docker run --rm -v \$(pwd):/app -w /app/backend node:20-alpine sh -c 'npm install'"
            }
        }

        stage('Docker: Build Images') {
            steps {
                sh "docker build -t ${IMAGE_NAME_FRONTEND}:${BUILD_NUMBER} ."
                sh "docker build -t ${IMAGE_NAME_BACKEND}:${BUILD_NUMBER} ./backend"
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

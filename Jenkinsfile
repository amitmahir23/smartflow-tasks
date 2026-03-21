pipeline {
    agent any

    tools {
        // This requires the 'NodeJS' plugin to be installed in Jenkins
        // and a NodeJS installation named '20' to be configured.
        nodejs '20'
    }

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
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Backend: Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Docker: Build Images') {
            steps {
                // Note: This requires Jenkins to have access to a Docker daemon
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

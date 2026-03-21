pipeline {
    agent any // Root agent stays 'any' to allow per-stage overrides

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
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Backend: Install') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Docker: Build Images') {
            // No docker agent here, we use the host's docker CLI
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

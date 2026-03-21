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

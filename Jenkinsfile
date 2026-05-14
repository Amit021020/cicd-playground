@Library('Shared') _

pipeline {
    agent any

    environment {
        PORT = '3000'
    }

    stages {

        stage('Clone') {
            steps {
                script {
                    clone(
                        "https://github.com/Amit021020/cicd-playground.git",
                        "main"
                    )
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    build("cicd-playground-app:latest", ".")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    dockerHubPush("cicd-playground-app", "latest")
                }
            }
        }

        stage('Create Env File') {
            steps {

                withCredentials([
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')
                ]) {

                    sh '''
                    echo "PORT=$PORT" > .env
                    echo "MONGO_URI=$MONGO_URI" >> .env
                    echo "JWT_SECRET=$JWT_SECRET" >> .env
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    deploy()
                }
            }
        }
    }
}
@Library('Shared') _
pipeline{
    agent any
    stages{
        stage('Clone'){
            steps{
                script{
                    clone("https://github.com/Amit021020/cicd-playground.git","main")
                }
            }
        }
        stage('Build'){
            steps{
                script{
                    build("cicd-playground-app:latest",".")
                }
            }
        }
        stage('Push to DockurHub'){
            steps{
                script{
                    dockerHubPush("cicd-playground-app","latest")
                }
            }
        }
        stage('Create Env File') {
            steps {
                sh '''
                echo "PORT=3000" > .env
                echo "MONGO_URI=mongodb://mongo:27017/cicd" >> .env
                echo "JWT_SECRET=secretKeyforjwtabchbcanafn" >> .env
                '''
            }
        }
        stage('Deploy'){
            steps{
                script{
                    deploy()
                }
            }
        }
        
    }
}

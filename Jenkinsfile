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
        stage('Deploy'){
            steps{
                script{
                    deploy()
                }
            }
        }
        
    }
}

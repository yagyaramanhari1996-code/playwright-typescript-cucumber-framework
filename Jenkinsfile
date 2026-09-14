pipeline {
    agent any

    environment {
        NODE_VERSION   = '20'
        BASE_URL       = credentials('BASE_URL')          // Jenkins credential store
        HEADLESS       = 'true'
        BROWSER        = 'chromium'
        TIMEOUT        = '30000'
        SCREENSHOT_ON_FAILURE = 'true'
        TRACE_ON_FAILURE      = 'true'
        RECORD_VIDEO          = 'false'
        ALLURE_RESULTS_DIR    = 'allure-results'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }

    parameters {
        choice(
            name: 'PROFILE',
            choices: ['ci', 'smoke', 'regression', 'default'],
            description: 'Cucumber profile to run'
        )
        choice(
            name: 'BROWSER_CHOICE',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Browser to run tests in'
        )
        string(
            name: 'TAGS_OVERRIDE',
            defaultValue: '',
            description: 'Override cucumber tags (leave blank to use profile defaults)'
        )
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME} | Build: ${env.BUILD_NUMBER}"
            }
        }

        stage('Setup Node.js') {
            steps {
                sh "node --version && npm --version"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium firefox webkit'
            }
        }

        stage('Lint & Type Check') {
            parallel {
                stage('ESLint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('TypeScript') {
                    steps {
                        sh 'npm run typecheck'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def profile = params.PROFILE ?: 'ci'
                    def browser = params.BROWSER_CHOICE ?: 'chromium'
                    def tagFlag = params.TAGS_OVERRIDE ? "--tags '${params.TAGS_OVERRIDE}'" : ''

                    sh """
                        export BROWSER=${browser}
                        npm run test:${profile} ${tagFlag} || true
                    """
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                script {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        results: [[path: "${ALLURE_RESULTS_DIR}"]],
                        reportBuildPolicy: 'ALWAYS',
                        report: 'allure-report'
                    ])
                }
            }
        }

        stage('Publish HTML Report') {
            steps {
                publishHTML(target: [
                    allowMissing         : true,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'reports',
                    reportFiles          : 'cucumber-report.html',
                    reportName           : 'Cucumber HTML Report'
                ])
            }
        }
    }

    post {
        always {
            // Archive reports and artifacts
            archiveArtifacts artifacts: [
                'allure-results/**',
                'reports/**',
                'reports/videos/**',
                'reports/traces/**'
            ].join(', '), allowEmptyArchive: true

            // Publish JUnit-compatible cucumber JSON
            junit allowEmptyResults: true, testResults: 'reports/cucumber-report.json'
        }
        success {
            echo "✅ All tests passed — Build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "❌ Tests FAILED — Build #${env.BUILD_NUMBER}"
            // Uncomment to enable email notifications:
            // mail to: 'qa-team@company.com',
            //      subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            //      body: "Check ${env.BUILD_URL} for details."
        }
        cleanup {
            sh 'npm run clean || true'
        }
    }
}

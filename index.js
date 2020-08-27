const core = require('@actions/core');
const github = require('@actions/github');
const aws = require("aws-sdk");
const assert = require("assert");

if (require.main === module) {
    run();
}

module.exports = run;

async function run() {
    var batch = new aws.Batch();
    var cloudwatch = new aws.CloudWatchLogs();

    let spin = ['-', '/', '|', '\\', '-', '/', '|', '\\'];
    let logGroupName = '/aws/batch/job';
    let regex = /[^A-Za-z0-9_\-]/g;

    var job_definitions = {
        'g4dn.4x': 'gluon-nlp-1-jobs:5',
        'g4dn.8x': 'gluon-nlp-1-jobs:4',
        'g4dn.12x': 'gluon-nlp-1-4gpu-jobs:1',
        'g4dn.16x': 'gluon-nlp-1-jobs:3',
        'p3.2x': 'gluon-nlp-1-jobs:11',
        'p3.8x': 'gluon-nlp-1-4gpu-jobs:2',
        'p3.16x': 'gluon-nlp-1-8gpu-jobs:1',
        'p3dn.24x': 'gluon-nlp-1-8gpu-jobs:2',
        'c5n.18x': 'gluon-nlp-1-cpu-jobs:2',
    }

    var job_queues = {
        'g4dn.4x': 'g4dn',
        'g4dn.8x': 'g4dn',
        'g4dn.12x': 'g4dn-multi-gpu',
        'g4dn.16x': 'g4dn',
        'p3.2x': 'p3',
        'p3.8x': 'p3-4gpu',
        'p3.16x': 'p3-8gpu',
        'p3dn.24x': 'p3dn-8gpu',
        'c5n.18x': 'c5n',
    }

    // let jobName = core.getInput('name').replace(regex, '').slice(0, 128);
    let jobName = 
    let jobType = core.getInput('job-type');
    console.log(jobName);
    let jobQueue = job_queues[jobType];
    let jobDefinition = job_definitions[jobType];
    let command = core.getInput('command').split(" ");
    let wait = core.getInput('wait');

    var parameters = {};
    parameters['SOURCE_REF'] = core.getInput('source-ref');
    parameters['WORK_DIR'] = core.getInput('work-dir');
    parameters['SAVED_OUTPUT'] = core.getInput('saved-output');
    parameters['SAVE_PATH'] = core.getInput('save-path');
    parameters['COMMAND'] = core.getInput('command');
    parameters['REMOTE'] = core.getInput('remote');

    var kwargs = {
        jobName : jobName,
        jobQueue : jobQueue,
        jobDefinition : jobDefinition,
        parameters : parameters,
    }
    if (core.getInput('time-out')) {
        kwargs['timeout'] = {'attemptDurationSeconds': core.getInput('time-out')}
    }

    var submitJobResponse;

    batch.submitJob(kwargs, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
            submitJobResponse = data;
        }
    })

    let jobId = submitJobResponse['jobId'];

    let BatchStatus = "Here!";

    console.log("*****STARTING UNITTEST*****");
    try {
        core.setOutput("batch-status", BatchStatus);
    } catch (error) {
        core.setFailed(error.message);
    } finally {
        console.log("*****UNITTEST COMPLETE*****");
    }

    // This is a comment1

    // This is a comment2

    // This is a comment3

    // This is a comment4

    // This is a comment5

    // This is a comment6

    // python3 -m pdb tools/batch/submit-job.py --region us-east-1 --source-ref numpy --job-type c5n.18x --name test_project --work-dir scripts/conversion_toolkits --remote https://github.com/barry-jin/gluon-nlp/ --command 'python3 hello_world.py' --wait 
}


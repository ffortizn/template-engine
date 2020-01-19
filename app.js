const inquirer = require('inquirer')
const fs = require('fs')

const htmlBegin = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://code.jquery.com/jquery.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="jumbotron text-center mb-4" style="background-color: darkorange;">
            <h1>My Team</h1>
        </div>`

const htmlRow = `<div class="row mb-4 justify-content-md-center">`

const htmlManager = `<div id="manager-card" class="card bg-light " style="width: 18rem;">
    <div class="card-header text-white bg-primary text-center">
        <h2 id="manager-name" class="card-title">{{Name}}</h2>
        <h4 class="card-title">Manager</h4>
    </div>
    <ul class="p-4 list-group">
        <li id="manager-id" class="list-group-item">{{ID}}</li>
        <li id="manager-email" class="list-group-item">{{Email}}</li>
        <li id="manager-office" class="list-group-item">{{Office}}</li>
    </ul>
</div>`

const htmlEngineer = `<div id="engineer-card" class="card bg-light" style="width: 18rem;">
    <div class="card-header text-white bg-primary text-center">
        <h2 id="engineer-name" class="card-title">{{Name}}</h2>
        <h4 class="card-title">Engineer</h4>
    </div>
    <ul class="p-4 list-group">
        <li id="engineer-id" class="list-group-item">{{ID}}</li>
        <li id="engineer-email" class="list-group-item">{{Email}}</li>
        <li id="manager-github" class="list-group-item">{{Github}}</li>
    </ul>
</div>`

const htmlIntern = `<div id="intern-card" class="card bg-light " style="width: 18rem;">
    <div class="card-header text-white bg-primary text-center">
        <h2 id="manager-name" class="card-title">{{Name}}</h2>
        <h4 class="card-title">Intern</h4>
    </div>
    <ul class="p-4 list-group">
        <li id="intern-id" class="list-group-item">{{ID}}</li>
        <li id="intern-email" class="list-group-item">{{Email}}</li>
        <li id="intern-school" class="list-group-item">{{School}}</li>
    </ul>
</div>`

const htmlEnd = `</div></div></body></html>`

var htmlFile = '';

const engineer = [];
const intern = [];
const manager = [{
    name: 'Francisco Ortiz',
    id: 101,
    email: 'fortiz@xapienx.com',
    role: 'Manager'
}]

const role = ['Manager', 'Engineer', 'Intern']
const myAnswers = [];
var questions = [
    {
        type: 'input',
        name: 'name',
        message: "Name:"
    },
    {
        type: 'input',
        name: 'id',
        message: "ID:"
    },
    {
        type: 'input',
        name: 'email',
        message: "Email:"
    },
    {
        type: 'list',
        name: 'role',
        choices: role,
        message: "Role:"
    }
    ,
    {
        type: 'input',
        name: 'office',
        message: 'Office:',
        when: function (answers) {
            return answers.role === 'Manager';
        }
    },
    {
        type: 'input',
        name: 'github',
        message: 'Github:',
        when: function (answers) {
            return answers.role === 'Engineer';
        }
    },
    {
        type: 'input',
        name: 'school',
        message: 'School:',
        when: function (answers) {
            return answers.role === 'Intern';
        }
    }
];

function ask() {
    inquirer.prompt(questions).then(answers => {
        myAnswers.push(answers);
        inquirer.prompt({
            type: 'confirm',
            name: 'askAgain',
            message: 'Enter another team mate?',
            default: true
        }).then(answers => {
            if (answers.askAgain) {
                console.info('----------------------------------------\n')
                ask();
            } else {
                console.info('\nGenerating team.html...');
                htmlTeam();
            }
        });
    });
}

function htmlTeam() {
    myAnswers.forEach(element => {
        switch (element.role) {
            case 'Manager':
                manager.pop();
                manager.push(element);
                break;
            case 'Engineer':
                engineer.push(element);
                break;
            case 'Intern':
                intern.push(element);
                break;
        }
    });
    
    // HTML
    htmlFile = htmlBegin;

    // htmlManager
    str = htmlManager;
    str = str.replace("{{Name}}", "Name: " + manager[0].name)
    str = str.replace("{{ID}}", "ID: " + manager[0].id)
    str = str.replace("{{Email}}", "Email: " + manager[0].email)
    str = str.replace("{{Office}}", "Office: " + manager[0].office)
    htmlFile = htmlFile + htmlRow + str + "</div>";

    // htmlEngineer
    htmlFile = htmlFile + htmlRow
    engineer.forEach(element => {
        str = htmlEngineer;
        str = str.replace("{{Name}}", "Name: " + element.name)
        str = str.replace("{{ID}}", "ID: " + element.id)
        str = str.replace("{{Email}}", "Email: " + element.email)
        str = str.replace("{{Github}}", "Github: " + element.github)
        htmlFile = htmlFile + str;
    });
    htmlFile = htmlFile + "</div>";

    // htmlIntern
    htmlFile = htmlFile + htmlRow
    intern.forEach(element => {
        str = htmlIntern;
        str = str.replace("{{Name}}", "Name: " + element.name)
        str = str.replace("{{ID}}", "ID: " + element.id)
        str = str.replace("{{Email}}", "Email: " + element.email)
        str = str.replace("{{School}}", "School: " + element.school)
        htmlFile = htmlFile + str;
    });
    htmlFile = htmlFile + "</div>";
    
    // htmlEnd
    htmlFile = htmlFile + htmlEnd

    writeHtml(htmlFile);
}

function writeHtml(htmlFile) {
    fs.writeFile('./output/team.html', htmlFile, function (err) {
        if (err) throw err;
        console.info('HTML has been saved!');
    });
}

ask();
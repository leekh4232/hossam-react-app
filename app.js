import * as util from "util";
import fs from "fs";
import shelljs from "shelljs";
import minimist from 'minimist';
import { exec } from 'child_process';

// 현재 작업 디렉토리
const cwd = shelljs.pwd().toString();

// 명령줄 파라미터
const projectName = minimist(process.argv.slice(2))['_'][0];

const execp = util.promisify(exec);
const addonPackages = [
    'react-router-dom', 
    'prop-types', 
    'react-helmet-async', 
    'styled-reset', 
    'styled-components', 
    'styled-components-breakpoints', 
    'dayjs', 
    'classnames', 
    'axios', 
    'react-loader-spinner',
    'react-redux', 
    '@reduxjs/toolkit', 
    'redux-devtools-extension', 
    'react-intersection-observer'
];

// 명령줄 파라미터
console.log("-----------------------------------------");
console.log("|    React.js 프로젝트 생성기           |");
console.log("|    메가스터디IT아카데미 이광호 강사   |");
console.log("-----------------------------------------");
console.log(`${cwd.replaceAll("\\", '/')}/${projectName} 위치에 프로젝트를 생성합니다.`);
console.log(`자동 설치 라이브러리: ${addonPackages.join(', ')}\n`);
//process.exit();

/**
 * React Project 생성
 * @param {string} projectName 
 */
async function createApp(projectName = "") {
    console.log("----------------------------------");
    console.log(" 1. 프로젝트를 생성합니다.");
    console.log("----------------------------------");
    console.log(`echo $ yarn create react-app ${projectName}`);

    try {
        const {stdout, stderr} = await execp(`yarn create react-app ${projectName}`);
        console.log(stdout);
        console.log(`\n새로운 리액트 앱 ${projectName}(이)가 생성되었습니다.\n\n`)
    } catch (e) {
        throw e;
    }
}

/**
 * 리액트 프로젝트를 yarn-berry 버전으로 변경
 * @param {str} projectName 
 */
async function setYarnBerry(projectName = "") {
    console.log("----------------------------------");
    console.log(" 2. 프로젝트를 yarn berry로 변경합니다.");
    console.log("----------------------------------");

    process.chdir(`./${projectName}`);
    console.log(`$ yarn set version berry`);

    try {
        const {stdout, stderr} = await execp(`yarn set version berry`);
        console.log(stdout);
    } catch (e) {
        throw e;
    }

    console.log(`$ yarn install`);

    try {
        const {stdout, stderr} = await execp(`yarn install`);
        console.log(stdout);
    } catch (e) {
        throw e;
    }
}

/**
 * pnp 모드 설정
 */
async function setPnpMode() {
    console.log("----------------------------------");
    console.log(" 3. berry의 모드를 pnp로 변경합니다.");
    console.log("----------------------------------");

    let yarnrc = fs.readFileSync('.yarnrc.yml', 'utf8');
    let yarnrcReplace = yarnrc.replaceAll('node-modules', 'pnp');
    fs.writeFileSync('.yarnrc.yml', yarnrcReplace, 'utf8');

    let pkJson = fs.readFileSync('package.json', 'utf8');
    let pkJsonReplace = pkJson.replaceAll('eslintConfig', 'x-eslintConfig');
    fs.writeFileSync('package.json', pkJsonReplace, 'utf8');
}

/**
 * 필수 패키지 설치
 */
async function installPackages() {
    console.log("----------------------------------");
    console.log(" 4. 필수 패키지를 설치합니다.");
    console.log("----------------------------------");

    for (let i=0; i<addonPackages.length; i++) {
        console.log(`$ yarn add ${addonPackages[i]}`);
        try {
            const {stdout, stderr} = await execp(`yarn add ${addonPackages[i]}`);
            console.log(stdout);
        } catch (e) {
            throw e;
        }
    } 
}

/**
 * VSCode 호출
 */
async function callCode(projectName) {
    console.log(` ${projectName} 프로젝트가 생성되었습니다. Visual Studio Code를 호출합니다.`);
    try {
        const {stdout, stderr} = await execp(`code .`);
        console.log(stdout);
    } catch (e) {
        throw e;
    }
}

(async () => {
    await createApp(projectName);
    await setYarnBerry(projectName);
    await setPnpMode();
    await installPackages();
    await callCode(projectName);
})();
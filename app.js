#!/usr/bin/env node

import shelljs from "shelljs";
import fs from "fs";
import * as util from "util";
import shelljs from "shelljs";
import minimist from 'minimist';
import { exec } from 'child_process';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';

// 현재 작업 디렉토리
const cwd = shelljs.pwd().toString().replaceAll("\\", '/');
console.log(cwd);

// 명령줄 파라미터
const args = minimist(process.argv.slice(1))['_'];
let projectName = args[args.length - 1];

if (projectName.includes("/") || projectName.includes("\\")) {
    projectName = "hello-react-app";
} else {
    projectName = projectName.toLowerCase();
}

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

/**
 * React Project 생성
 * @param {string} projectName
 */
async function createApp(projectName = "") {
    // console.log("----------------------------------");
    // console.log(" 1. 프로젝트를 생성합니다.");
    // console.log("----------------------------------");
    // console.log(`echo $ yarn create react-app ${projectName}`);

    if (fs.existsSync(projectName)) {
        throw new Error(`이미 ${projectName} 디렉토리가 존재합니다. 삭제 후 다시 실행해주세요.\n\twindows: rmdir /q/s ${projectName}\n\tmac: rm -rf ${projectName}`);
    }

    try {
        const {stdout, stderr} = await execp(`yarn create react-app ${projectName}`);
        // console.log(stdout);
        // console.log(`\n새로운 리액트 앱 ${projectName}(이)가 생성되었습니다.`);
    } catch (e) {
        throw new Error(`리액트 앱 생성 중 오류가 발생했습니다. >> ${e.message}`);
    }
}

/**
 * 리액트 프로젝트를 yarn-berry 버전으로 변경
 * @param {str} projectName
 */
async function setYarnBerry(projectName = "") {
    // console.log("----------------------------------");
    // console.log(" 2. 프로젝트를 yarn berry로 변경합니다.");
    // console.log("----------------------------------");

    process.chdir(`./${projectName}`);
    //console.log(`$ yarn set version berry`);

    try {
        const {stdout, stderr} = await execp(`yarn set version berry`);
        //console.log(stdout);
    } catch (e) {
        throw new Error(`yarn berry로 변경 중 오류가 발생했습니다. >> ${e.message}`);
    }

    //console.log(`$ yarn install`);

    try {
        const {stdout, stderr} = await execp(`yarn install`);
        //console.log(stdout);
    } catch (e) {
        throw new Error(`yarn install 중 오류가 발생했습니다. >> ${e.message}`);
    }
}

/**
 * pnp 모드 설정
 */
async function setPnpMode() {
    // console.log("----------------------------------");
    // console.log(" 3. berry의 모드를 pnp로 변경합니다.");
    // console.log("----------------------------------");

    try {
        let yarnrc = fs.readFileSync('.yarnrc.yml', 'utf8');
        let yarnrcReplace = yarnrc.replaceAll('node-modules', 'pnp');
        fs.writeFileSync('.yarnrc.yml', yarnrcReplace, 'utf8');

        let pkJson = fs.readFileSync('package.json', 'utf8');
        let pkJsonReplace = pkJson.replaceAll('eslintConfig', 'x-eslintConfig');
        fs.writeFileSync('package.json', pkJsonReplace, 'utf8');
    } catch (e) {
        throw new Error(`pnp 모드 설정 중 오류가 발생했습니다. >> ${e.message}`);
    }
}

/**
 * 필수 패키지 설치
 */
async function installPackages(bar1) {
    // console.log("----------------------------------");
    // console.log(" 4. 필수 패키지를 설치합니다.");
    // console.log("----------------------------------");

    for (let i=0; i<addonPackages.length; i++) {
        // console.log(`$ yarn add ${addonPackages[i]}`);
        bar1.update(3, {status: `필수 패키지를 설치합니다. $ yarn add ${addonPackages[i]}`});
        try {
            const {stdout, stderr} = await execp(`yarn add ${addonPackages[i]}`);
            //console.log(stdout);
        } catch (e) {
            throw new Error(`${addonPackages[i]} 패키지 설치 중 오류가 발생했습니다. >> ${e.message}`);
        }
    }
}

/**
 * VSCode 호출
 */
async function callCode(projectName) {
    // console.log(` ${projectName} 프로젝트가 생성되었습니다. Visual Studio Code를 호출합니다.`);
    try {
        const {stdout, stderr} = await execp(`code .`);
        //console.log(stdout);
    } catch (e) {
        throw new Error(`Visual Studio Code 호출 중 오류가 발생했습니다. >> ${e.message}`);
    }
}

(async () => {
    // 명령줄 파라미터
    console.log("-----------------------------------------");
    console.log("|    React.js 프로젝트 생성기           |");
    console.log("|    메가스터디IT아카데미 이광호 강사   |");
    console.log("-----------------------------------------");
    console.log(`${cwd}/${projectName} 위치에 프로젝트를 생성합니다.`);
    console.log(`자동 설치 라이브러리: ${addonPackages.join(', ')}\n`);

    const bar1 = new cliProgress.SingleBar({
        //format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% - [{value}/{total}] {status}',
        format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% | {status}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    }, cliProgress.Presets.shades_classic);

    bar1.start(4, 0, {
        status: ""
    });

    try {
        bar1.update(0, {status: "프로젝트를 생성 중입니다."});
        await createApp(projectName);

        bar1.update(1, {status: "yarn berry로 변경 중입니다."});
        await setYarnBerry(projectName);

        bar1.update(2, {status: "pnp 모드를 설정 중입니다."});
        await setPnpMode();

        bar1.update(3, {status: "필수 패키지를 설치합니다."});
        await installPackages(bar1);

        bar1.update(4, {status: "프로젝트 생성이 완료되었습니다."});
        //await callCode(projectName);

        //bar1.update(5, {status: "프로젝트 생성이 완료되었습니다. fin :) "});
        bar1.stop();
    } catch (e) {
        bar1.stop();
        console.error(`\n[Error] ${e.message}`);
    }
})();
#!/usr/bin/env node

import fs from "fs";
import * as util from "util";
import shelljs from "shelljs";
import minimist from 'minimist';
import { exec } from 'child_process';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    'react-intersection-observer',
    'react-snap'
];

var workCount = 0;
var totalWorkCount = 13 + addonPackages.length - 1 + 15;

/**
 * React Project 생성
 * @param {string} projectName
 */
async function createApp(projectName = "",  bar1) {
    if (fs.existsSync(projectName)) {
        throw new Error(`이미 ${projectName} 디렉토리가 존재합니다. 삭제 후 다시 실행해주세요.\n\twindows: rmdir /q/s ${projectName}\n\tmac: rm -rf ${projectName}`);
    }

    bar1.update(workCount++, {status: "프로젝트를 생성합니다."});
    try {
        const {stdout, stderr} = await execp(`yarn create react-app ${projectName}`);
        // console.log(stdout);
        // console.log(`\n새로운 리액트 앱 ${projectName}(이)가 생성되었습니다.`);
    } catch (e) {
        throw new Error(`리액트 앱 생성 중 오류가 발생했습니다. >> ${e.message}`);
    }
    workCount += 10;
}

/**
 * 리액트 프로젝트를 yarn-berry 버전으로 변경
 * @param {str} projectName
 */
async function setYarnBerry(projectName = "",  bar1) {

    bar1.update(workCount++, {status: "프로젝트를 yarn berry로 변경합니다."});
    process.chdir(`./${projectName}`);

    try {
        const {stdout, stderr} = await execp(`yarn set version berry`);
    } catch (e) {
        throw new Error(`yarn berry로 변경 중 오류가 발생했습니다. >> ${e.message}`);
    }

    try {
        const {stdout, stderr} = await execp(`yarn install`);
    } catch (e) {
        throw new Error(`yarn install 중 오류가 발생했습니다. >> ${e.message}`);
    }
    workCount += 5;
}

/**
 * pnp 모드 설정
 */
async function setPnpMode(bar1) {
    bar1.update(workCount++, {status: "berry의 모드를 pnp로 변경합니다."});

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
    bar1.update(workCount++, {status: "필수 패키지를 설치합니다."});

    for (let i=0; i<addonPackages.length; i++) {
        bar1.update(workCount++, {status: `필수 패키지를 설치합니다. $ yarn add ${addonPackages[i]}`});
        try {
            const {stdout, stderr} = await execp(`yarn add ${addonPackages[i]}`);
        } catch (e) {
            throw new Error(`${addonPackages[i]} 패키지 설치 중 오류가 발생했습니다. >> ${e.message}`);
        }
    }
}

/**
 * 프로젝트 기본 상태 구성
 */
function createDefaultState(bar1) {
    bar1.update(workCount++, {status: "프로젝트의 기본 상태를 구성합니다."});

    const targets = ['App.js', 'index.js', 'App.css', 'App.test.js', 'index.css', 'logo.svg', 'setupTests.js', 'reportWebVitals.js'];

    fs.unlinkSync(`public/index.html`);
    for (let i=0; i<targets.length; i++) {
        try {
            fs.unlinkSync(`src/${targets[i]}`);
        } catch (err) {
            continue;
        }
    }
    
    fs.mkdirSync('src/components');
    fs.mkdirSync('src/assets');
    fs.mkdirSync('src/assets/css');
    fs.mkdirSync('src/assets/img');
    fs.mkdirSync('src/pages');
    fs.mkdirSync('src/slices');
    fs.mkdirSync('src/helpers');

    bar1.update(workCount++, {status: "프로젝트의 기본 상태를 구성합니다. (index.js)"});
    try {
        fs.copyFileSync(path.join(__dirname,  'index.js.template'),  'src/index.js');
    } catch (err) {}

    bar1.update(workCount++, {status: "프로젝트의 기본 상태를 구성합니다. (store.js)"});
    try {
        fs.copyFileSync(path.join(__dirname,  'store.js.template'),  'src/store.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (App.js)`});
    const appTemplate = fs.readFileSync(path.join(__dirname, 'App.js.template'), {
        encoding: 'utf8', flag: 'r'
    });

    fs.writeFileSync('src/App.js', appTemplate.replaceAll('{projectName}',  projectName), {
        encoding: 'utf8', flag: 'w'
    });

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (GlobalStyles.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'GlobalStyles.js.template'),  'src/components/GlobalStyles.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (MenuLink.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'MenuLink.js.template'),  'src/components/MenuLink.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (Meta.js)`});
    const metaTemplate = fs.readFileSync(path.join(__dirname, 'Meta.js.template'), {
        encoding: 'utf8', flag: 'r'
    });

    fs.writeFileSync('src/components/Meta.js', metaTemplate.replaceAll('{projectName}',  projectName), {
        encoding: 'utf8', flag: 'w'
    });

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (MediaQuery.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'MediaQuery.js.template'),  'src/components/MediaQuery.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (UtilHelper.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'UtilHelper.js.template'),  'src/helpers/UtilHelper.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (AxiosHelper.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'AxiosHelper.js.template'),  'src/helpers/AxiosHelper.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (ReduxHelper.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'ReduxHelper.js.template'),  'src/helpers/ReduxHelper.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (RegexHelper.js)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'RegexHelper.js.template'),  'src/helpers/RegexHelper.js');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (index.html)`});
    const indexTemplate = fs.readFileSync(path.join(__dirname, 'index.html.template'), {
        encoding: 'utf8', flag: 'r'
    });

    fs.writeFileSync('public/index.html', indexTemplate.replaceAll('{projectName}',  projectName), {
        encoding: 'utf8', flag: 'w'
    });
    
    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (sample.jpg)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'sample.jpg'),  'src/assets/img/sample.jpg');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (clear.bat)`});
    try {
        fs.copyFileSync(path.join(__dirname,  'clear.bat'),  'clear.bat');
    } catch (err) {}

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (remove .gitignore)`});
    try {
        fs.unlinkSync('.gitignore');
    } catch (err) {
    }

    bar1.update(workCount++, {status: `프로젝트의 기본 상태를 구성합니다. (remove .git)`});
    try {
        fs.rmSync('.git', { recursive: true, force: true });
    } catch (err) {
    }
}

(async () => {
    // 명령줄 파라미터
    console.log("+----------------------------------------------+");
    console.log("|                Hossam React App              |");
    console.log("|             메가스터디 IT 아카데미           |");
    console.log("|       이광호 강사 (leekh4232@gmail.com)      |");
    console.log("+----------------------------------------------+");
    console.log("본 프로그램은 메가스터디IT아카데미 프론트엔드 수업에서의 활용을 목적으로 개발되었습니다.\nMIT 라이센스를 따릅니다.\n");

    console.log(`프로젝트 생성 위치: ${cwd}/${projectName}`);
    console.log(`자동 설치 라이브러리: ${addonPackages.join(', ')}\n`);

    const bar1 = new cliProgress.SingleBar({
        //format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% - [{value}/{total}] {status}',
        format: 'CLI Progress |' + colors.cyan('{bar}') + '| {percentage}% | {status}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    }, cliProgress.Presets.shades_classic);

    bar1.start(totalWorkCount, 0, {
        status: ""
    });

    try {
        await createApp(projectName,  bar1);
        await setYarnBerry(projectName,  bar1);
        await setPnpMode(bar1);
        await installPackages(bar1);
        createDefaultState(bar1);

        bar1.update(totalWorkCount, {status: `프로젝트 생성이 완료되었습니다.`});
        bar1.stop();
    } catch (e) {
        bar1.stop();
        console.error(`\n[Error] ${e.message}`);
    }
})();
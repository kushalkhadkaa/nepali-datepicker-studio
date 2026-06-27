#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const failures = [];

const publicPages = [
  "index.html",
  "customizer.html",
  "docs.html",
  "changelog.html",
  "about.html",
];

const requiredFiles = [
  ...publicPages,
  "dist/nepali-datepicker.js",
  "dist/nepali-datepicker.css",
  "dist/nepali-datepicker.d.ts",
  "assets/js/about.js",
  "assets/js/changelog.js",
  "assets/js/customizer.js",
  "assets/js/docs.js",
  "assets/js/ndp-theme-init.js",
  "assets/js/playground.js",
  "assets/css/about.css",
  "assets/css/changelog.css",
  "assets/css/customizer.css",
  "assets/css/docs.css",
  "assets/css/playground.css",
  "README.md",
  "LICENSE",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
  "package.json",
  "package-lock.json",
  "playwright.config.js",
  "tests/browser-smoke.spec.js",
];

function absolute(file) {
  return path.join(root, file);
}

function fail(message) {
  failures.push(message);
}

function read(file) {
  return fs.readFileSync(absolute(file), "utf8");
}

function exists(file) {
  return fs.existsSync(absolute(file));
}

function walk(dir, predicate, results = []) {
  const fullDir = absolute(dir);
  if (!fs.existsSync(fullDir)) return results;

  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(relative, predicate, results);
    } else if (predicate(relative)) {
      results.push(relative);
    }
  }

  return results;
}

function checkRequiredFiles() {
  for (const file of requiredFiles) {
    if (!exists(file)) {
      fail(`Missing required public release file: ${file}`);
      continue;
    }

    const stat = fs.statSync(absolute(file));
    if (!stat.isFile() || stat.size === 0) {
      fail(`Required file is empty or invalid: ${file}`);
    }
  }
}

function checkPackageEntrypoints() {
  const pkg = JSON.parse(read("package.json"));
  const fields = ["main", "style", "types", "browser"];

  for (const field of fields) {
    if (!pkg[field]) {
      fail(`package.json is missing "${field}".`);
    } else if (!exists(pkg[field])) {
      fail(`package.json "${field}" points to a missing file: ${pkg[field]}`);
    }
  }

  if (!pkg.repository || !String(pkg.repository.url || "").includes("github.com/kushalkhadkaa/nepali-datepicker-studio")) {
    fail("package.json repository does not point to the public GitHub project.");
  }

  if (pkg.license !== "MIT") {
    fail("package.json license must remain MIT for the open-source release.");
  }

  if (!Array.isArray(pkg.files) || !pkg.files.includes("dist/")) {
    fail("package.json files must include dist/ for npm publish readiness.");
  }

  if (!pkg.exports || !pkg.exports["."] || pkg.exports["."].types !== "./dist/nepali-datepicker.d.ts") {
    fail("package.json exports must expose the TypeScript declaration file.");
  }

  if (!pkg.publishConfig || pkg.publishConfig.access !== "public") {
    fail("package.json publishConfig.access must be public.");
  }

  if (!pkg.scripts || !pkg.scripts["test:browser"] || !pkg.scripts["pack:check"]) {
    fail("package.json must include test:browser and pack:check scripts.");
  }
}

function checkJavaScriptSyntax() {
  const files = [
    ...walk("dist", (file) => file.endsWith(".js")),
    ...walk("assets/js", (file) => file.endsWith(".js")),
    "scripts/validate-release.js",
    "playwright.config.js",
    "tests/browser-smoke.spec.js",
  ].sort();

  for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", absolute(file)], {
      encoding: "utf8",
    });

    if (result.status !== 0) {
      fail(`JavaScript syntax failed in ${file}:\n${result.stderr || result.stdout}`);
    }
  }
}

function checkCssFiles() {
  const files = [
    ...walk("dist", (file) => file.endsWith(".css")),
    ...walk("assets/css", (file) => file.endsWith(".css")),
  ].sort();

  for (const file of files) {
    const css = read(file).trim();
    if (!css) {
      fail(`CSS file is empty: ${file}`);
    }
  }
}

function checkHtmlSeo() {
  for (const file of publicPages) {
    const html = read(file);
    const titleCount = (html.match(/<title>[\s\S]*?<\/title>/gi) || []).length;
    const h1Count = (html.match(/<h1\b/gi) || []).length;

    if (!/^<!doctype html>/i.test(html.trimStart())) {
      fail(`${file} must start with <!DOCTYPE html>.`);
    }
    if (titleCount !== 1) {
      fail(`${file} must contain exactly one <title>. Found ${titleCount}.`);
    }
    if (!/<meta\s+name=["']description["']/i.test(html)) {
      fail(`${file} is missing a meta description.`);
    }
    if (!/<link\s+rel=["']canonical["']/i.test(html)) {
      fail(`${file} is missing a canonical URL.`);
    }
    if (h1Count !== 1) {
      fail(`${file} must contain exactly one <h1>. Found ${h1Count}.`);
    }
    if (!/<script\b/i.test(html)) {
      fail(`${file} does not load any JavaScript.`);
    }
  }
}

function checkSitemapAndRobots() {
  const sitemap = read("sitemap.xml");
  const robots = read("robots.txt");
  const base = "https://kushalkhadkaa.github.io/nepali-datepicker-studio";

  if (!/<urlset\b/i.test(sitemap)) {
    fail("sitemap.xml is missing the urlset root element.");
  }

  for (const page of publicPages) {
    const url = page === "index.html" ? `${base}/` : `${base}/${page}`;
    if (!sitemap.includes(url)) {
      fail(`sitemap.xml is missing ${url}`);
    }
  }

  if (!robots.includes("Sitemap:")) {
    fail("robots.txt is missing the Sitemap directive.");
  }
}

function checkReadmeScreenshots() {
  const readme = read("README.md");
  const screenshotLinks = [...readme.matchAll(/\]\((assets\/screenshots\/[^)]+)\)/g)].map((match) => match[1]);

  if (screenshotLinks.length < 4) {
    fail("README.md should include several screenshot references for GitHub readers.");
  }

  for (const file of screenshotLinks) {
    if (!exists(file)) {
      fail(`README.md references a missing screenshot: ${file}`);
    }
  }
}

function checkOpenSourceSignals() {
  const readme = read("README.md");
  const license = read("LICENSE");

  if (!/MIT License/i.test(license)) {
    fail("LICENSE must include the MIT License heading.");
  }

  for (const section of ["Introduction", "System Architecture", "Conversion Algorithm", "DatePicker Algorithm", "FAQ"]) {
    if (!readme.includes(`## ${section}`)) {
      fail(`README.md is missing the "${section}" section.`);
    }
  }
}

checkRequiredFiles();
checkPackageEntrypoints();
checkJavaScriptSyntax();
checkCssFiles();
checkHtmlSeo();
checkSitemapAndRobots();
checkReadmeScreenshots();
checkOpenSourceSignals();

if (failures.length > 0) {
  console.error("Release validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Release validation passed.");

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const processRow_1 = require("../utils/processRow");
const workerDataTyped = worker_threads_1.workerData;
const results = workerDataTyped.data.map((row, index) => (0, processRow_1.processRow)(row, index + 1, workerDataTyped.csvInfoRecordId));
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage(results);

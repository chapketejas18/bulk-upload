import { parentPort, workerData } from "worker_threads";
import { processRow } from "../utils/processRow";
import { ObjectId } from "mongodb";

interface WorkerData {
  data: Record<string, any>[];
  csvInfoRecordId: ObjectId;
}

const workerDataTyped = workerData as WorkerData;

const results = workerDataTyped.data.map((row, index) =>
  processRow(row, index + 1, workerDataTyped.csvInfoRecordId)
);

parentPort?.postMessage(results);

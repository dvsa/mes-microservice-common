import { formatApplicationReference } from "./tars";
import { TestResultSchemasUnion } from "@dvsa/mes-test-schema/categories";
import { TestCategory } from "@dvsa/mes-test-schema/category-definitions/common/test-category";
import { IndependentDriving, QuestionResult, TestCentre } from "@dvsa/mes-test-schema/categories/common";
import { Circuit } from "@dvsa/mes-test-schema/categories/AM1";
import { get } from "lodash";

/**
 * Formats test results into a format usable for Examiner Records.
 *
 * @param testResult the test result to be formatted
 * @returns a new object featuring relevant data for Examiner Records
 */
export interface ExaminerRecordModel {
  appRef: number,
  testCategory: TestCategory,
  testCentre: TestCentre,
  startDate: string,
  routeNumber?: number,
  controlledStop?: boolean,
  independentDriving?: IndependentDriving,
  circuit?: Circuit,
  safetyQuestions?: QuestionResult[],
  balanceQuestions?: QuestionResult[],
  manoeuvres?: any,
  showMeQuestions?: QuestionResult[],
  tellMeQuestions?: QuestionResult[],
}

export const formatForExaminerRecords = (testResult: TestResultSchemasUnion): ExaminerRecordModel => {
  let result: ExaminerRecordModel = {
    appRef: formatApplicationReference(testResult.journalData.applicationReference),
    testCategory: testResult.category as TestCategory,
    testCentre: testResult.journalData.testCentre,
    startDate: testResult.journalData.testSlotAttributes.start,
  };

  [
    {field: 'controlledStop', value: get(testResult, 'testData.controlledStop.selected')},
    {field: 'independentDriving', value: get(testResult, 'testSummary.independentDriving')},
    {field: 'circuit', value: get(testResult, 'testSummary.circuit')},
    {field: 'safetyQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.safetyQuestions')},
    {field: 'balanceQuestions', value: get(testResult, 'testData.safetyAndBalanceQuestions.balanceQuestions')},
    {field: 'manoeuvres', value: get(testResult, 'testData.manoeuvres')},
  ].forEach(item => {
    if (item.value) {
      result = {
        ...result,
        [item.field]: item.value,
      }
    }
  });

  let routeNumber = get(testResult, 'testSummary.routeNumber');
  if (routeNumber) {
    result = {
      ...result,
      routeNumber: Number(routeNumber),
    }
  }

  let showQuestion = get(testResult, 'testData.vehicleChecks.showMeQuestion');
  let showQuestions = get(testResult, 'testData.vehicleChecks.showMeQuestions');
  if (showQuestion) {
    result = {
      ...result,
      showMeQuestions: [showQuestion],
    }
  } else if (showQuestions) {
    result = {
      ...result,
      showMeQuestions: showQuestions,
    }
  }
  let tellQuestion = get(testResult, 'testData.vehicleChecks.tellMeQuestion');
  let tellQuestions = get(testResult, 'testData.vehicleChecks.tellMeQuestions');
  if (tellQuestion) {
    result = {
      ...result,
      tellMeQuestions: [tellQuestion],
    }
  } else if (tellQuestions) {
    result = {
      ...result,
      tellMeQuestions: tellQuestions,
    }
  }
  return result;
};

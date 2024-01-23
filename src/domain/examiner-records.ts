import {formatApplicationReference} from "./tars";
import {TestResultSchemasUnion} from "@dvsa/mes-test-schema/categories";
import {TestCategory} from "@dvsa/mes-test-schema/category-definitions/common/test-category";
import {IndependentDriving, QuestionResult, TestCentre} from "@dvsa/mes-test-schema/categories/common";
import {Circuit} from "@dvsa/mes-test-schema/categories/AM1";
import {get} from "lodash";

/**z
 * Formats test results into a format usable for Examiner Records.
 *
 * @param testResult the test result to be formatted
 * @returns a new object featuring relevant data for Examiner Records
 */
export interface ExaminerRecordModel {
    appRef: number,
    testCategory?: TestCategory,
    testCentre?: TestCentre,
    routeNumber?: number,
    startDate?: string,
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
    return <ExaminerRecordModel>{
        appRef: formatApplicationReference(get(testResult, 'journalData.applicationReference')),
        testCategory: get(testResult, 'category', null) as TestCategory,
        testCentre: get(testResult, 'journalData.testCentre', null) as TestCentre,
        routeNumber: Number(get(testResult, 'testSummary.routeNumber', null)),
        startDate: testResult.journalData.testSlotAttributes.start,
        controlledStop: get(testResult, 'testData.controlledStop.selected', null) as boolean | null,
        independentDriving: get(testResult, 'testSummary.independentDriving', null) as IndependentDriving | null,
        circuit: get(testResult, 'testSummary.circuit', null) as Circuit | null,
        safetyQuestions: get(testResult, 'testData.safetyAndBalanceQuestions.safetyQuestions', []) as QuestionResult[],
        balanceQuestions: get(testResult, 'testData.safetyAndBalanceQuestions.balanceQuestions', []) as QuestionResult[],
        manoeuvres: get(testResult, 'testData.manoeuvres'),
        showMeQuestions: [
            ...[get(testResult, 'testData.vehicleChecks.showMeQuestion', [])] as [QuestionResult],
            ...get(testResult, 'testData.vehicleChecks.showMeQuestions', []) as QuestionResult[],
        ],
        tellMeQuestions: [
            ...[get(testResult, 'testData.vehicleChecks.tellMeQuestion', [])] as [QuestionResult],
            ...get(testResult, 'testData.vehicleChecks.tellMeQuestions', []) as QuestionResult[],
        ],
    };
};

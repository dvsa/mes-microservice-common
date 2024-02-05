import { TestCategory } from "@dvsa/mes-test-schema/category-definitions/common/test-category";
import { IndependentDriving, QuestionResult, TestCentre } from "@dvsa/mes-test-schema/categories/common";
import { Circuit } from "@dvsa/mes-test-schema/categories/AM1";

/**
 * Interface for Examiner Records
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

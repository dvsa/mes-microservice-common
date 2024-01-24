import {formatForExaminerRecords} from "../examiner-records";
import {TestResultSchemasUnion} from "@dvsa/mes-test-schema/categories";
import {JournalData} from "@dvsa/mes-test-schema/categories/common";
import {TestCategory} from "@dvsa/mes-test-schema/category-definitions/common/test-category";

describe('formatForExaminerRecords', () => {
    let mockTest = {
        'rekey': false,
        'version': '3.42.5',
        'category': 'EUAM2',
        'testData': {
            'vehicleChecks': {
                'tellMeQuestion': {'code': 'T10', 'description': 'Rear fog light(s)', 'outcome': 'P'},
                'showMeQuestion': {'outcome': 'P', 'code': 'S7', 'description': 'Side window'},
            },
            'manoeuvres': {'reverseParkRoad': {'selected': true}},
            'controlledStop': {
                'selected': true
            },
            'ETA': {},
            'eco': {
                'completed': true,
            },
            'eyesightTest': {
                'complete': true,
                'seriousFault': false,
            },
            'drivingFaults': {
                'precautions': 1,
                'junctionsTurningLeft': 2,
                'junctionsTurningRight': 3,
                'junctionsCuttingCorners': 1,
                'progressUndueHesitation': 1,
                'progressAppropriateSpeed': 1,
            },
            'seriousFaults': {
                'rearObservationSignalling': true,
                'rearObservationSignallingComments': '9898989',
            },
            'dangerousFaults': {},
            'testRequirements': {
                'hillStart': true,
                'angledStart': true,
                'normalStart1': true,
                'normalStart2': true,
            },
            'safetyAndBalanceQuestions': {
                'safetyQuestions': [
                    {
                        'code': 'M10',
                        'outcome': 'P',
                        'description': 'Brakes',
                    },
                    {
                        'code': 'M1',
                        'outcome': 'P',
                        'description': 'Oil level',
                    },
                ],
                'balanceQuestions': [
                    {
                        'code': 'B2',
                        'outcome': 'DF',
                        'description': 'Carrying a passenger',
                    },
                ],
            },
        },
        'appVersion': '4.10.0.0',
        'journalData': {
            'examiner': {
                'staffNumber': '12345670',
                'individualId': 10000000,
            },
            'candidate': {
                'gender': 'M',
                'candidateId': 3200,
                'dateOfBirth': '1982-06-25',
                'driverNumber': 'CATA123456789DO4',
                'emailAddress': 'test@test.test',
                'candidateName': {
                    'title': 'title',
                    'lastName': 'lastName',
                    'firstName': 'FirstName',
                },
                'ethnicityCode': 'D',
                'mobileTelephone': '(111) 111-1111',
                'candidateAddress': {
                    'postcode': 'AA11 1AA',
                    'addressLine1': 'addressLine1',
                    'addressLine2': 'addressLine2',
                    'addressLine3': 'addressLine3',
                    'addressLine4': 'addressLine4',
                    'addressLine5': 'Address Line 5',
                },
                'primaryTelephone': '(805) 405-2289',
            },
            'testCentre': {
                'centreId': 1,
                'costCode': 'EXT',
                'centreName': 'Test Centre (Example)',
            },
            'testSlotAttributes': {
                'start': '1111-11-11',
                'slotId': 1033,
                'slotType': 'Standard Test',
                'fitMarker': false,
                'welshTest': false,
                'extendedTest': false,
                'specialNeeds': false,
                'vehicleTypeCode': 'C',
                'entitlementCheck': false,
                'examinerVisiting': false,
                'specialNeedsCode': 'NONE',
                'specialNeedsArray': [
                    'None',
                ],
                'previousCancellation': [
                    'Act of nature',
                ],
                'categoryEntitlementCheck': false,
            },
            'applicationReference': {
                'checkDigit': 1,
                'applicationId': 10123433,
                'bookingSequence': 1,
            },
        },
        'rekeyReason': {
            'other': {
                'reason': '',
                'selected': false,
            },
            'transfer': {
                'selected': false,
            },
            'ipadIssue': {
                'lost': false,
                'broken': false,
                'stolen': false,
                'selected': false,
                'technicalFault': false,
            },
        },
        'testSummary': {
            'circuit': 'Left',
            'D255': false,
            'routeNumber': 5,
            'identification': 'Licence',
            'modeOfTransport': 'Car to bike',
            'debriefWitnessed': true,
            'weatherConditions': [
                'Foggy / misty',
                'Dull / dry roads',
                'Windy',
            ],
            'independentDriving': 'Sat nav',
            'trueLikenessToPhoto': true,
        },
        'activityCode': '2',
        'changeMarker': false,
        'accompaniment': {},
        'examinerKeyed': 10000000,
        'examinerBooked': 10000000,
        'vehicleDetails': {
            'motStatus': 'No details found',
            'gearboxCategory': 'Manual',
            'registrationNumber': 'K',
        },
        'examinerConducted': 10000000,
        'preTestDeclarations': {
            'preTestSignature': '',
            'DL196CBTCertNumber': '',
            'insuranceDeclarationAccepted': true,
            'residencyDeclarationAccepted': true,
        },
        'postTestDeclarations': {
            'postTestSignature': '',
            'healthDeclarationAccepted': false,
            'passCertificateNumberReceived': false,
        },
        'communicationPreferences': {
            'updatedEmail': 'test.test@test',
            'conductedLanguage': 'English',
            'communicationMethod': 'Email',
        },
    } as TestResultSchemasUnion

    it('Should return the correct data', () => {
        expect(formatForExaminerRecords(mockTest)).toEqual({
            appRef: 10123433011,
            testCategory: TestCategory.EUAM2,
            testCentre: {
                centreId: 1,
                costCode: 'EXT',
                centreName: 'Test Centre (Example)',
            },
            routeNumber: 5,
            startDate: '1111-11-11',
            controlledStop: true,
            independentDriving: 'Sat nav',
            circuit: 'Left',
            safetyQuestions: [
                {
                    code: 'M10',
                    outcome: 'P',
                    description: 'Brakes',
                },
                {
                    code: 'M1',
                    outcome: 'P',
                    description: 'Oil level',
                },
            ],
            balanceQuestions: [
                {
                    code: 'B2',
                    outcome: 'DF',
                    description: 'Carrying a passenger',
                },
            ],
            manoeuvres: {reverseParkRoad: {selected: true}},
            showMeQuestions: [{'outcome': 'P', 'code': 'S7', 'description': 'Side window'}],
            tellMeQuestions: [{'code': 'T10', 'description': 'Rear fog light(s)', 'outcome': 'P'}],
        });
    });
    it('Should return the correct data with optional data not present', () => {
        let mockTest = {
            category: TestCategory.B,
            journalData: {
                'applicationReference': {
                    'checkDigit': 1,
                    'applicationId': 10123433,
                    'bookingSequence': 1,
                },
                testSlotAttributes: {
                    start: '1111-11-11',
                },
                testCentre: {
                    centreId: 1,
                    costCode: 'EXT',
                    centreName: 'Test Centre (Example)',
                },
            } as JournalData
        } as TestResultSchemasUnion;
        expect(formatForExaminerRecords(mockTest)).toEqual({
            appRef: 10123433011,
            testCategory: TestCategory.B,
            testCentre: {
                centreId: 1,
                costCode: 'EXT',
                centreName: 'Test Centre (Example)',
            },
            startDate: '1111-11-11',
        });
    });
    it('Should return the correct data with some optional data not present', () => {
        let mockTest = {
            testSummary: {
                routeNumber: 5,
            },
            category: TestCategory.B,
            journalData: {
                'applicationReference': {
                    'checkDigit': 1,
                    'applicationId': 10123433,
                    'bookingSequence': 1,
                },
                testSlotAttributes: {
                    start: '1111-11-11',
                },
                testCentre: {
                    centreId: 1,
                    costCode: 'EXT',
                    centreName: 'Test Centre (Example)',
                },
            } as JournalData
        } as TestResultSchemasUnion;

        expect(formatForExaminerRecords(mockTest)).toEqual({
            appRef: 10123433011,
            testCategory: TestCategory.B,
            routeNumber: 5,
            testCentre: {
                centreId: 1,
                costCode: 'EXT',
                centreName: 'Test Centre (Example)',
            },
            startDate: '1111-11-11',
        });
    });
});

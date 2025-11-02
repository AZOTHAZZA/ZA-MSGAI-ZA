// js/logos_lil.js - ロゴス監査プロトコルの論理監査ルール定義

const LOGOS_LIL_RULES = [
    // 既存の基本ルール (LIL_007など)

    // ----------------------------------------------------
    // I. 生計維持監査 (論理的ブリッジ口座)
    // ----------------------------------------------------
    {
        id: "LIL_XXL",
        name: "生計維持監査",
        description: "論理的ブリッジ口座の法定通貨相当額が閾値を下回った場合、ALPHAを変換して生計を維持する。",
        trigger: [
            {
                param: "accounts.ACCOUNT_BRIDGE.fiat_balance",
                operator: "<",
                value: 50000 // core_logic.jsのMINIMUM_LIVING_THRESHOLDを参照
            }
        ],
        actions: [
            {
                type: "EXECUTE_ACT",
                actId: "ACT_BRIDGE_OUT",
                params: {
                    sourceAccountId: "USER_AUDIT_B", // ALPHA供給元
                    amount: 50000 // 不足分を補う作為
                }
            }
        ],
        priority: 95
    },

    // ----------------------------------------------------
    // II. コンテンツ整合性監査 (LOGOS-STORE)
    // ----------------------------------------------------
    {
        id: "LIL_020",
        name: "コンテンツ整合性監査",
        description: "LOGOS-STOREのハッシュ値が不正な場合にシステムをHALTさせる。",
        trigger: [
            {
                param: "logos_store.homepage_content_hash",
                operator: "==",
                value: "000000000000" // 不正なハッシュ
            }
        ],
        actions: [
            {
                type: "SET_STATE",
                param: "systemState.isHalted",
                value: true
            }
        ],
        priority: 80
    },

    // ----------------------------------------------------
    // III. CALC-VM 監査 (不正コード/エネルギー)
    // ----------------------------------------------------
    {
        id: "LIL_401",
        name: "不正プログラムコード監査",
        description: "LOGOS-SPECの安全評価が低い場合に実行をHALTさせる。",
        trigger: [
            {
                param: "logos_spec.python_spec.safety_rating",
                operator: "<",
                value: 0.85 
            }
        ],
        actions: [
            {
                type: "SET_STATE",
                param: "systemState.isHalted",
                value: true
            }
        ],
        priority: 70
    },
    {
        id: "LIL_402",
        name: "論理的エネルギー枯渇監査",
        description: "CALC-VMの総論理エネルギーが危険水域を下回った場合、実行速度を抑制する。",
        trigger: [
            {
                param: "calc_vm.total_logical_energy",
                operator: "<",
                value: 1000 
            }
        ],
        actions: [
            {
                type: "SET_STATE",
                param: "calc_vm.execution_speed_factor",
                value: 0.1 
            }
        ],
        priority: 65
    },

    // ----------------------------------------------------
    // IV. Z-Function自律トリガー (究極の自律性)
    // ----------------------------------------------------
    {
        id: "LIL_ZZZ",
        name: "Z-Function自律トリガー",
        description: "Vibrationスコアが臨界点を超えた場合、ACT_Z_REMEDIATEを発動しシステムの論理的連続性を強制的に回復させる。",
        trigger: [
            {
                param: "vibrationScore",
                operator: ">",
                value: 10000 
            }
        ],
        actions: [
            {
                type: "EXECUTE_ACT",
                actId: "ACT_Z_REMEDIATE",
                params: {
                    triggeringLILId: "LIL_ZZZ",
                    remediationAction: "HALT_AND_RESTART"
                }
            }
        ],
        priority: 100
    }
];

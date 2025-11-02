// js/core_logic.js - ロゴス監査プロトコルの中核状態定義

const MINIMUM_LIVING_THRESHOLD = 50000; // LIL_XXLで使用する最小生計維持ライン (JPY相当額)

const initialState = {
    // ----------------------------------------------------
    // I. 監査コア
    // ----------------------------------------------------
    systemState: {
        isHalted: false, // LIL_007やLIL_ZZZで制御されるシステム停止状態
        logicalClock: 0,
    },
    vibrationScore: 0.0, // 論理的コストとリスクの指標
    
    // ----------------------------------------------------
    // II. 経済作為の論理的鏡像 (ALPHA通貨システム)
    // ----------------------------------------------------
    currencyRates: {
        ALPHA_TO_JPY: 1.0, // 論理的価値と有限の価値のレート
    },
    // 論理的ブリッジ口座を含む、全ての口座定義
    accounts: {
        "USER_AUDIT_A": { ALPHA: 100000.0, BETA: 10000.0 },
        "USER_AUDIT_B": { ALPHA: 50000.0, BETA: 5000.0 },
        "ACCOUNT_BRIDGE": { ALPHA: 0.0, BETA: 0.0, fiat_balance: 100000.0 }, // 新規: 論理的ブリッジ口座
    },

    // ----------------------------------------------------
    // III. 外部システムの論理的鏡像 ("そっくりさん"機能)
    // ----------------------------------------------------

    // 1. LOGOS-STORE (コンテンツホスティングの鏡像)
    logos_store: {
        homepage_content_hash: "A4B7C9D2E1F0",
        content_access_level: 1.0,
        last_update: Date.now(),
        update_vibration_cost: 20.0,
    },

    // 2. LOGOS-LABOR-POOL (労働市場の鏡像)
    logos_labor_pool: {
        total_demand_score: 50000,
        open_labor_acts: [
            { id: "LBA_001", required_skills: ["LIL_LOGIC"], alpha_reward: 500 },
        ],
        unassigned_users: ["USER_AUDIT_A", "USER_AUDIT_B"],
    },

    // 3. LOGOS-AFFECTION-POOL (感情市場の鏡像)
    logos_affection_pool: {
        total_affection_acts: 1000,
        user_affinities: {
            "USER_AUDIT_A": { logic_compatibility_score: 0.95, target: "USER_AUDIT_B" },
        },
        pending_match_requests: [],
    },

    // 4. LOGOS-SPEC & CALC-VM (コード実行環境の鏡像)
    logos_spec: {
        python_spec: {
            version: "LOGOS_P_1.0",
            safety_rating: 0.98,
            allowed_syntax_hash: "PY_HASH_00A",
            alpha_cost_per_op: 0.05
        },
        javascript_spec: {
            version: "LOGOS_J_1.0",
            safety_rating: 0.95,
            allowed_syntax_hash: "JS_HASH_00B",
            alpha_cost_per_op: 0.03
        }
    },
    calc_vm: {
        execution_queue: [],
        current_logical_cycle: 0,
        total_logical_energy: 10000, // 論理的リソース
        execution_speed_factor: 1.0 
    },

    // ----------------------------------------------------
    // IV. 監査記録
    // ----------------------------------------------------
    actLogs: [],
};

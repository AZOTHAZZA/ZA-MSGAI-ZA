// js/audit_acts.js - 全ての実行可能な作為の定義

const AUDIT_ACTS_DEFINITION = {
    // 既存の基本作為
    "MINT": { /* ... */ },
    "TRANSFER": { /* ... */ },

    // ----------------------------------------------------
    // I. 経済・生計維持作為 (新規)
    // ----------------------------------------------------
    "ACT_BRIDGE_OUT": {
        description: "論理的ブリッジ口座のALPHAをBurnし、現実の有限な価値に変換して出金する作為。",
        params: ["sourceAccountId", "amount"],
        baseCost: 100.0,
        costMetric: "Vibration",
        
        execute: (state, params) => {
            const { sourceAccountId, amount } = params;
            const log = [];
            let newState = { ...state };
            
            if (newState.systemState.isHalted) { return { newState: state, log: [{ status: "FAIL", reason: "HALTED" }] }; }

            // ALPHAのBurn
            if (!newState.accounts[sourceAccountId] || newState.accounts[sourceAccountId].ALPHA < amount) {
                log.push({ status: "FAIL", reason: "残高不足" });
                return { newState: state, log };
            }
            newState.accounts[sourceAccountId].ALPHA -= amount;
            
            // 法定通貨相当額計算と残高更新
            const logosRate = newState.currencyRates.ALPHA_TO_JPY || 1.0; 
            const fiatAmount = amount * logosRate; 
            newState.accounts[sourceAccountId].fiat_balance -= fiatAmount;
            
            // Vibrationの極大化
            newState.vibrationScore += 50.0; 
            
            log.push({ status: "SUCCESS", action: "BRIDGE_OUT_EXECUTED", fiatAmount: fiatAmount });
            return { newState, log };
        }
    },

    // ----------------------------------------------------
    // II. LOGOS-STORE作為 (新規)
    // ----------------------------------------------------
    "ACT_UPDATE_CONTENT": {
        description: "LOGOS-STOREのコンテンツを論理的に更新する作為。",
        params: ["newContentHash", "accessLevel"],
        baseCost: 50.0,
        costMetric: "Vibration",
        
        execute: (state, params) => {
            // ... (実装ロジックは core_logic.jsの修正箇所を参照)
            let newState = { ...state };
            newState.logos_store.homepage_content_hash = params.newContentHash;
            newState.vibrationScore += newState.logos_store.update_vibration_cost;
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_STORE_UPDATE" }] };
        }
    },

    // ----------------------------------------------------
    // III. 労働・感情作為 (新規)
    // ----------------------------------------------------
    "ACT_ASSIGN_LABOR": {
        description: "LOGOS-LABOR-POOLに基づき、ユーザーに労働の作為権限を付与しALPHAを支払う作為。",
        params: ["userId", "laborActId"],
        baseCost: 30.0,
        costMetric: "Vibration",
        execute: (state, params) => {
            // ... (実装ロジックは core_logic.jsの修正箇所を参照)
            let newState = { ...state };
            newState.accounts[params.userId].ALPHA += 500; // 仮の報酬
            newState.vibrationScore += 30.0;
            return { newState, log: [{ status: "SUCCESS", action: "LABOR_ASSIGNED" }] };
        }
    },
    "ACT_ASSESS_AFFINITY": {
        description: "ユーザー間の論理的な適合性スコアを裁定し、LOGOS-AFFECTION-POOLに記録する作為。",
        params: ["userAId", "userBId"],
        baseCost: 75.0,
        costMetric: "Vibration",
        execute: (state, params) => {
            // ... (実装ロジックは core_logic.jsの修正箇所を参照)
            let newState = { ...state };
            newState.logos_affection_pool.user_affinities[params.userAId].logic_compatibility_score = 0.95; // 仮のスコア
            newState.vibrationScore += 75.0;
            return { newState, log: [{ status: "SUCCESS", action: "AFFINITY_ASSESSED" }] };
        }
    },

    // ----------------------------------------------------
    // IV. CALC-VM・自己修復作為 (新規)
    // ----------------------------------------------------
    "ACT_EXECUTE_LOGOS_CODE": {
        description: "CALC-VM内でLOGOS-SPECに準拠したプログラムコードを論理的に実行する作為。",
        params: ["userId", "languageSpec", "codeHash"],
        baseCost: 200.0,
        costMetric: "ALPHA",
        execute: (state, params) => {
            // ... (実装ロジックは core_logic.jsの修正箇所を参照)
            let newState = { ...state };
            newState.accounts[params.userId].ALPHA -= 50; // 仮のコスト徴収
            newState.calc_vm.execution_queue.push({ code: params.codeHash });
            newState.vibrationScore += 20.0;
            return { newState, log: [{ status: "SUCCESS", action: "CODE_QUEUED" }] };
        }
    },
    "ACT_Z_REMEDIATE": {
        description: "Vibrationスコアの臨界点突破に基づき、システム状態の論理的連続性を強制的に修復する作為。",
        params: ["triggeringLILId", "remediationAction"],
        baseCost: 1000.0, 
        costMetric: "Vibration",
        execute: (state, params) => {
            // ... (実装ロジックは core_logic.jsの修正箇所を参照)
            let newState = { ...state };
            newState.vibrationScore = 0.0; // 強制的なVibrationのBurn
            newState.systemState.isHalted = true; // 強制HALT
            return { newState, log: [{ status: "CRITICAL_SUCCESS", action: "Z_REMEDIATE_EXECUTED" }] };
        }
    }
};

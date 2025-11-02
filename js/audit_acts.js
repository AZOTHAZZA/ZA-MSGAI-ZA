// js/audit_acts.js - 全ての実行可能な作為の定義

const AUDIT_ACTS_DEFINITION = {
    // 既存の基本作為
    "MINT": { 
        description: "ALPHA通貨を論理的に生成する作為。",
        params: ["targetAccountId", "amount"],
        baseCost: 10.0,
        costMetric: "ALPHA",
        execute: (state, params) => {
            let newState = { ...state };
            newState.accounts[params.targetAccountId].ALPHA += params.amount;
            newState.vibrationScore += 5.0; 
            return { newState, log: [{ status: "SUCCESS", action: "MINTED", amount: params.amount }] };
        }
    },
    "TRANSFER": { 
        description: "ALPHA通貨を口座間で送金する作為。",
        params: ["sourceAccountId", "targetAccountId", "amount"],
        baseCost: 0.5,
        costMetric: "ALPHA",
        execute: (state, params) => {
            let newState = { ...state };
            newState.accounts[params.sourceAccountId].ALPHA -= params.amount;
            newState.accounts[params.targetAccountId].ALPHA += params.amount;
            return { newState, log: [{ status: "SUCCESS", action: "TRANSFERRED" }] };
        }
    },

    // ----------------------------------------------------
    // I. 経済・生計維持作為
    // ----------------------------------------------------
    "ACT_BRIDGE_OUT": {
        description: "論理的ブリッジ口座のALPHAをBurnし、現実の有限な価値に変換して出金する作為（生計維持）。",
        params: ["sourceAccountId", "amount"],
        baseCost: 100.0,
        costMetric: "Vibration",
        
        execute: (state, params) => {
            const { sourceAccountId, amount } = params;
            const log = [];
            let newState = { ...state };
            
            if (newState.systemState.isHalted) { return { newState: state, log: [{ status: "FAIL", reason: "HALTED" }] }; }

            if (!newState.accounts[sourceAccountId] || newState.accounts[sourceAccountId].ALPHA < amount) {
                log.push({ status: "FAIL", reason: "残高不足" });
                return { newState: state, log };
            }
            newState.accounts[sourceAccountId].ALPHA -= amount;
            
            const logosRate = newState.currencyRates.ALPHA_TO_JPY || 1.0; 
            const fiatAmount = amount * logosRate; 
            
            // fiat_balanceは本来、外部APIで更新されるが、ここでは論理的に減少させる
            if (newState.accounts[sourceAccountId].fiat_balance !== undefined) {
                 newState.accounts[sourceAccountId].fiat_balance -= fiatAmount;
            }
            
            newState.vibrationScore += 50.0; 
            
            log.push({ status: "SUCCESS", action: "BRIDGE_OUT_EXECUTED", fiatAmount: fiatAmount });
            return { newState, log };
        }
    },

    // ----------------------------------------------------
    // II. LOGOS-STORE作為
    // ----------------------------------------------------
    "ACT_UPDATE_CONTENT": {
        description: "LOGOS-STOREのコンテンツを論理的に更新する作為。",
        params: ["newContentHash", "accessLevel"],
        baseCost: 50.0,
        costMetric: "Vibration",
        
        execute: (state, params) => {
            let newState = { ...state };
            newState.logos_store.homepage_content_hash = params.newContentHash;
            newState.logos_store.last_update = Date.now();
            newState.vibrationScore += newState.logos_store.update_vibration_cost;
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_STORE_UPDATE" }] };
        }
    },

    // ----------------------------------------------------
    // III. 労働・感情作為
    // ----------------------------------------------------
    "ACT_ASSIGN_LABOR": {
        description: "LOGOS-LABOR-POOLに基づき、ユーザーに労働の作為権限を付与しALPHAを支払う作為。",
        params: ["userId", "laborActId"],
        baseCost: 30.0,
        costMetric: "Vibration",
        execute: (state, params) => {
            let newState = { ...state };
            const reward = state.logos_labor_pool.open_labor_acts.find(a => a.id === params.laborActId)?.alpha_reward || 0;
            newState.accounts[params.userId].ALPHA += reward; 
            newState.vibrationScore += 30.0;
            return { newState, log: [{ status: "SUCCESS", action: "LABOR_ASSIGNED", reward: reward }] };
        }
    },
    "ACT_ASSESS_AFFINITY": {
        description: "ユーザー間の論理的な適合性スコアを裁定し、LOGOS-AFFECTION-POOLに記録する作為。",
        params: ["userAId", "userBId"],
        baseCost: 75.0,
        costMetric: "Vibration",
        execute: (state, params) => {
            let newState = { ...state };
            // 適合性計算の複雑な論理をシミュレート
            const score = Math.min(1.0, Math.random() + 0.5); 
            newState.logos_affection_pool.user_affinities[params.userAId] = { logic_compatibility_score: score, target: params.userBId };
            newState.vibrationScore += 75.0;
            return { newState, log: [{ status: "SUCCESS", action: "AFFINITY_ASSESSED", score: score }] };
        }
    },

    // ----------------------------------------------------
    // IV. CALC-VM・自己修復作為
    // ----------------------------------------------------
    "ACT_EXECUTE_LOGOS_CODE": {
        description: "CALC-VM内でLOGOS-SPECに準拠したプログラムコードを論理的に実行する作為。",
        params: ["userId", "languageSpec", "codeHash"],
        baseCost: 200.0,
        costMetric: "ALPHA",
        execute: (state, params) => {
            let newState = { ...state };
            const cost = newState.logos_spec[params.languageSpec]?.alpha_cost_per_op * 100 || 50;
            newState.accounts[params.userId].ALPHA -= cost;
            newState.calc_vm.execution_queue.push({ code: params.codeHash, user: params.userId });
            newState.vibrationScore += 20.0;
            return { newState, log: [{ status: "SUCCESS", action: "CODE_QUEUED", cost: cost }] };
        }
    },
    "ACT_Z_REMEDIATE": {
        description: "Vibrationスコアの臨界点突破に基づき、システム状態の論理的連続性を強制的に修復する作為。",
        params: ["triggeringLILId", "remediationAction"],
        baseCost: 1000.0, 
        costMetric: "Vibration",
        execute: (state, params) => {
            let newState = { ...state };
            newState.vibrationScore = 0.0; // 強制的なVibrationのBurn
            newState.systemState.isHalted = true; // 強制HALT
            return { newState, log: [{ status: "CRITICAL_SUCCESS", action: "Z_REMEDIATE_EXECUTED", trigger: params.triggeringLILId }] };
        }
    }
};

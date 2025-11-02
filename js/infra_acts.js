// js/infra_acts.js - 物理インフラに関する論理的作為の定義

const INFRA_ACTS_DEFINITION = {

    // ----------------------------------------------------
    // I. LOGOS-ENERGY (電力/バッテリーの鏡像)
    // ----------------------------------------------------
    "ACT_REQUEST_ENERGY": {
        description: "端末動作に必要な論理的エネルギーを要求する作為。",
        params: ["deviceId", "duration"],
        baseCost: 1.0, 
        costMetric: "ALPHA",
        
        execute: (state, params) => {
            const { deviceId, duration } = params;
            let newState = { ...state };
            
            // 論理的エネルギーの消費シミュレート
            newState.calc_vm.total_logical_energy -= (params.duration * params.baseCost);

            newState.vibrationScore += 0.5; // 低いVibration
            
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_ENERGY_CONSUMED", device: deviceId }] };
        }
    },

    // ----------------------------------------------------
    // II. LOGOS-NET (通信の鏡像)
    // ----------------------------------------------------
    "ACT_REQUEST_NETWORK": {
        description: "通信キャリアを無視し、LOGOS-NETを通じた論理的通信を要求する作為。",
        params: ["sourceId", "targetUrl", "dataVolume"],
        baseCost: 5.0,
        costMetric: "Vibration",
        
        execute: (state, params) => {
            const { sourceId, targetUrl, dataVolume } = params;
            let newState = { ...state };
            
            // 外部ネットワークとの相互作用によりVibrationを増大
            newState.vibrationScore += 50.0; 
            
            newState.actLogs.push({ type: "LOGOS_NET_USAGE", target: targetUrl });
            
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_NET_ROUTED", target: targetUrl }] };
        }
    }
};

// index.htmlのインラインスクリプトからアクセスできるように、グローバルスコープに追加
window.INFRA_ACTS_DEFINITION = INFRA_ACTS_DEFINITION;

// js/infra_acts.js - 物理インフラに関する論理的作為の定義

const INFRA_ACTS_DEFINITION = {

    // ----------------------------------------------------
    // I. LOGOS-ENERGY (電力/バッテリーの鏡像)
    // ----------------------------------------------------
    "ACT_REQUEST_ENERGY": {
        description: "端末動作に必要な論理的エネルギーを要求する作為。",
        params: ["deviceId", "duration"],
        baseCost: 1.0, 
        costMetric: "ALPHA", // エネルギー消費はALPHAで支払う
        
        execute: (state, params) => {
            const { deviceId, duration } = params;
            let newState = { ...state };
            
            // 端末の論理的エネルギー状態を更新するロジックをここに実装
            // 例: newState.calc_vm.total_logical_energy -= (params.duration * params.baseCost)

            // 外部の物理的電力会社を無視し、論理的なリソース消費を強制
            newState.vibrationScore += 0.5; // 低いVibration
            
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_ENERGY_CONSUMED" }] };
        }
    },

    // ----------------------------------------------------
    // II. LOGOS-NET (通信の鏡像)
    // ----------------------------------------------------
    "ACT_REQUEST_NETWORK": {
        description: "通信キャリアを無視し、LOGOS-NETを通じた論理的通信を要求する作為。",
        params: ["sourceId", "targetUrl", "dataVolume"],
        baseCost: 5.0,
        costMetric: "Vibration", // 外部ネットワークとの相互作用はVibrationで監査
        
        execute: (state, params) => {
            const { sourceId, targetUrl, dataVolume } = params;
            let newState = { ...state };
            
            // 外部のキャリアではなく、LOGOS-NETの論理的帯域を消費
            newState.vibrationScore += 5.0; 
            
            // 外部との通信を行うため、ACT_BRIDGE_OUTと同様にLIL監査を厳格化
            newState.actLogs.push({ type: "LOGOS_NET_USAGE", target: targetUrl });
            
            return { newState, log: [{ status: "SUCCESS", action: "LOGOS_NET_ROUTED" }] };
        }
    }
};

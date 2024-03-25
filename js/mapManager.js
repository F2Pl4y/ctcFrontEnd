// mapManager.js
const mapRegistry = {};

export const registerMap = (mapId, mapInstance) => {
    mapRegistry[mapId] = mapInstance;
};

export const getMap = (mapId) => {
    return mapRegistry[mapId];
};

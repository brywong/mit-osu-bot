"use strict";
/*** Bot's regular functions ***/
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAdmin = void 0;
const ADMIN_UIDS = ['401460835232382986', '151462465404796929'];
/** WYSI at 727 ET counter */
function detectWysi(mid) {
    return false;
}
/** Checks if a user is admin */
function checkIsAdmin(uid) {
    return ADMIN_UIDS.includes(uid);
}
exports.checkIsAdmin = checkIsAdmin;

import Vue from 'vue'
//权限判断
function hasPermission(permissions,index) {
    if (permissions.indexOf(index) > -1) {
        return true;
    } else {
        return false;
    }
}
export {
    hasPermission
}

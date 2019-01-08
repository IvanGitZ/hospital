import WSSoftPhone from './WSSoftPhone'
var wsServerURL = "ws://124.205.41.228:8180/WSAgentServer_111/websocket";
let phone = null
// const self = this
export function demo() {
  phone = new WSSoftPhone({
    agentId : "A08_admin",
    agentName : "A08_admin",
    ins : '608001',
    serverUri : wsServerURL,
    delegatorId : '',
    workModeSettings : null
  }, {
    onInited : function(delegatorId) {
      console.log('delegatorId', delegatorId)
      oninit(delegatorId)
      // self.onInited(delegatorId);
    },
    onNotifySettings : function() {
      console.log('onNotifySettings')
      // self.onNotifySettings();
    },
    onLogonSucc : function(ins) {
      console.log('登录话务', ins)
      // self.onLogonSucc(ins);
    },
    onLogonFailed : function(ins, errNum, errDesc) {
      console.log('登录失败')
      // self.onLogonFailed(ins, errNum, errDesc);
    },
    onLogoffSucc : function(ins) {
      self.onLogoffSucc(ins);
    },
    onTrace : function(strmsg) {
      console.log('跟踪信息', strmsg)
      // self.trace(strmsg);
    },
    onWSOpen : function() {
      console.log('onWSOpen')
      // self.onWSOpen();
    },
    onWSClose : function() {
      self.onWSClose();
    },
    onWSConnectFailed:function(){
      self.onWSConnectFailed();
    },
    onStateChange : function(state) {
      console.log('状态改变', state)
      // 初始化0，空闲3，离席23，监听16，外呼8，内呼24，退出1, 通话中6，保持7，通话结束19
      // self.onStateChange(state);
    },
    onWorkModeChange : function(workmode) {
      self.onWorkModeChange(workmode);
    },
    onQueueChange : function(queueList) {
      console.log('队列变化', queueList)
      // self.onQueueChange(queueList);
    },
    onShowTip : function(info) {
      console.log('显示提示信息', info)
      // self.onShowTip(info);
    },
    onCallArrive : function(coInfos) {
      // 进行弹屏处理
      console.log('弹屏处理', coInfos)
      // self.onCallArrive(coInfos);
    },
    onPrepareDialSucc : function() {
      // 进行号码输入界面或者通讯录显示
      self.onPrepareDialSucc();
    },
    onPrepareCallOutSucc : function() {
      // 显示号码输入界面或者通讯录显示
      self.onPrepareCallOutSucc();
    },
    onDialBegin : function(coInfos) {
      // 进行外拨信息显示
      self.onDialBegin(coInfos);
    },
    onDialSucc : function(coInfos) {
      self.onDialSucc(coInfos);
    },
    onDialFailed : function(errorCode) {
      self.onDialFailed(errorCode);
    },
    onWebSocketReplaced : function() {
      // 屏蔽软电话界面，仅显示重新创建的按钮
      console.log('软电话被顶替')
      // self.onWebSocketReplaced();
    },
    onConfirmReplaceWebSocket : function() {
      // 存在已有连接，确认是否需要顶替
      console.log('存在已有连接，确认是否需要顶替')
      // self.onConfirmReplaceWebSocket();
    },
    onRefreshAgentListSucc : function(agentList) {
      // 显示坐席列表供选择
      self.onRefreshAgentListSucc(agentList);
    },
    onDevConnected : function() {
      console.log('通话开始')
      // self.onDevConnected();
    },
    onDevDisconnected : function() {
      self.onDevDisconnected();
    },
    onConsultStart : function(coInfos) {
      self.refreshUserPhone();
    },
    onConsultSucc : function(coInfos) {
      self.refreshUserPhone();
    },
    onConsultFailed : function(coInfos) {
      self.refreshUserPhone();
    },
    onConsultOver : function(coInfos) {
      self.refreshUserPhone();
    },
    onFunctionSwitch : function(functionCode, isSupport, isOn) {
      console.log('onFunctionSwitch', functionCode, isSupport, isOn)
      // self.onFunctionSwitch(functionCode, isSupport, isOn);
    },
    onWSHello : function() {
      console.log('onWSHello')
      // self.onWSHello();
    }
  })
  // 启动websocket服务
  phone.connectServer()
}
function oninit(delegatorId) {
  console.log(delegatorId)
  phone.delegatorId = delegatorId
  phone.logon()
}

export var ESPAttr = {
	"agentId" : "agentId",
	"agentState" : "agentState",
	"agentWorkMode" : "agentWorkMode",
	"leaveReason" : "leaveReason",
	"delegatorId" : "delegatorId",
	"stateSettings" : "stateSettings",
	"workModeSettings" : "workModeSettings",
	"leaveReasonSettings" : "leaveReasonSettings",
	"agentList" : "agentList",
	"queueList" : "queueList",

	"phoneNum" : "phoneNum",
	"destSPType" : "destSPType",
	"destSPIns" : "destSPIns",
	"agentListType" : "agentListType",
	"agentName" : "agentName",
	"tick" : "tick",
	"customInitParams" : "customInitParams",
	"controlType" : "controlType",
	"extraControlParam" : "extraControlParam",
	"destSPName" : "destSPName",
	"encryptMode":"encryptMode",
	"ani":"ani",
	"prefix":"prefix",
	"softPhoneCode":"softPhoneCode"
};

var EEncryptMode={
	"none" :"",
	"hide":"1",
	"rsa":"2",
	"des":"3",
};

// SPCommand枚举
export var ESPCommand = {
	"CheckWebSocket" : "CheckWebSocket",
	"Init" : "Init",
	"Logon" : "Logon",
	"Logoff" : "Logoff",
	"SetWorkMode" : "SetWorkMode",
	"Leave" : "Leave",
	"ResumeWork" : "ResumeWork",
	"PrepareDial" : "PrepareDial",
	"CancelPrepareDial" : "CancelPrepareDial",
	"Dial" : "Dial",
	"CancelDial" : "CancelDial",
	"DropCall" : "DropCall",
	"FinishWrapup" : "FinishWrapup",
	"Hold" : "Hold",
	"FetchHold" : "FetchHold",
	"Consult" : "Consult",
	"FinishConsult" : "FinishConsult",
	"CancelConsult" : "CancelConsult",
	"ConsultTransfer" : "ConsultTransfer",
	"RefreshAgentList" : "RefreshAgentList",
	"PrepareCallInner" : "PrepareCallInner",
	"CancelPrepareCallInner" : "CancelPrepareCallInner",
	"CallInner" : "CallInner",
	"CancelCallInner" : "CancelCallInner",
	"PrepareMonitor" : "PrepareMonitor",
	"CancelPrepareMonitor" : "CancelPrepareMonitor",
	"MonitorAgent" : "MonitorAgent",
	"FinishMonitor" : "FinishMonitor",
	"ConsultSwap" : "ConsultSwap",
	"ConsultSwapBack" : "ConsultSwapBack",
	"ConsultConf" : "ConsultConf",
	"DropConf" : "DropConf",
	"TransferToIVR" : "TransferToIVR",
	"OneStepTransfer" : "OneStepTransfer",
	"CancelWait" : "CancelWait",
	"AnswerCall" : "AnswerCall",
	"WSHello" : "WSHello",
	"SetFunctionSwitch" : "SetFunctionSwitch",
	"SendAgentMsg" : "SendAgentMsg",
	"MonitorControl" : "MonitorControl",
	"Intervence":"Intervence",
	"Intercept":"Intercept",
	"ForceDrop":"ForceDrop",
	"EncryptDial":"EncryptDial",


};

export var ESPEvent = {
	// "======"消息交互事件"======"
	"LogonSucc" : "LogonSucc",
	"LogonFailed" : "LogonFailed",
	"LogoffSucc" : "LogoffSucc",
	"LogoffFailed" : "LogoffFailed",
	"LeaveSucc" : "LeaveSucc",
	"LeaveFailed" : "LeaveFailed",
	"ResumeWorkSucc" : "ResumeWorkSucc",
	"ResumeWorkFailed" : "ResumeWorkFailed",
	"SetWorkModeFailed" : "SetWorkModeFailed",
	"SetWorkModeSucc" : "SetWorkModeSucc",
	"SetWorkModeOfflineSucc" : "SetWorkModeOfflineSucc",
	"PrepareDialSucc" : "PrepareDialSucc",
	"PrepareDialFailed" : "PrepareDialFailed",
	"CancelPrepareDialSucc" : "CancelPrepareDialSucc",
	"CancelPrepareDialFailed" : "CancelPrepareDialFailed",
	"DialAccepted" : "DialAccepted",
	"DialDenied" : "DialDenied",
	"DropCallSucc" : "DropCallSucc",
	"DropCallFailed" : "DropCallFailed",
	"FinishWrapupSucc" : "FinishWrapupSucc",
	"FinishWrapupFailed" : "FinishWrapupFailed",
	"HoldSucc" : "HoldSucc",
	"HoldFailed" : "HoldFailed",
	"FetchHoldSucc" : "FetchHoldSucc",
	"FetchHoldFailed" : "FetchHoldFailed",
	"ConsultStart" : "ConsultStart",
	"ConsultSucc" : "ConsultSucc",
	"ConsultFailed" : "ConsultFailed",
	"CancelConsultSucc" : "CancelConsultSucc",
	"CancelConsultFailed" : "CancelConsultFailed",
	"FinishConsultSucc" : "FinishConsultSucc",
	"FinishConsultFailed" : "FinishConsultFailed",
	"ConsultTransferSucc" : "ConsultTransferSucc",
	"ConsultTransferFailed" : "ConsultTransferFailed",
	"RefreshAgentListSucc" : "RefreshAgentListSucc",
	"RefreshMonitorAgentListSucc" : "RefreshMonitorAgentListSucc",
	"RefreshConsultAgentListSucc" : "RefreshConsultAgentListSucc",
	"RefreshCallInnerAgentListSucc" : "RefreshCallInnerAgentListSucc",
	"RefreshMsgAgentListSucc" : "RefreshMsgAgentListSucc",
	"PrepareCallInnerSucc" : "PrepareCallInnerSucc",
	"PrepareCallInnerFailed" : "PrepareCallInnerFailed",
	"CancelPrepareCallInnerSucc" : "CancelPrepareCallInnerSucc",
	"CancelPrepareCallInnerFailed" : "CancelPrepareCallInnerFailed",
	"CallInnerBegin" : "CallInnerBegin",
	"CallInnerSucc" : "CallInnerSucc",
	"CallInnerFailed" : "CallInnerFailed",
	"CancelCallInnerSucc" : "CancelCallInnerSucc",
	"CancelCallInnerFailed" : "CancelCallInnerFailed",
	"PrepareMonitorSucc" : "PrepareMonitorSucc",
	"PrepareMonitorFailed" : "PrepareMonitorFailed",
	"CancelPrepareMonitorSucc" : "CancelPrepareMonitorSucc",
	"CancelPrepareMonitorFailed" : "CancelPrepareMonitorFailed",
	"MonitorBegin" : "MonitorBegin",
	"MonitorSucc" : "MonitorSucc",
	"MonitorFailed" : "MonitorFailed",
	"FinishMonitorSucc" : "FinishMonitorSucc",
	"FinishMonitorFailed" : "FinishMonitorFailed",
	"OneStepTransferBegin" : "OneStepTransferBegin",
	"OneStepTransferSucc" : "OneStepTransferSucc",
	"OneStepTransferFailed" : "OneStepTransferFailed",
	"ConsultSwapSucc" : "ConsultSwapSucc",
	"ConsultSwapFailed" : "ConsultSwapFailed",
	"ConsultSwapBackSucc" : "ConsultSwapBackSucc",
	"ConsultSwapBackFailed" : "ConsultSwapBackFailed",
	"ConsultConfSucc" : "ConsultConfSucc",
	"ConsultConfFailed" : "ConsultConfFailed",
	"DropConfSucc" : "DropConfSucc",
	"DropConfFailed" : "DropConfFailed",
	"TransferBegin" : "TransferBegin",
	"TransferSucc" : "TransferSucc",
	"TransferFailed" : "TransferFailed",
	"CancelWaitSucc" : "CancelWaitSucc",
	"CancelWaitFailed" : "CancelWaitFailed",
	"CancelDialSucc" : "CancelDialSucc",
	"CancelDialFailed" : "CancelDialFailed",
	"AnswerCallSucc" : "AnswerCallSucc",
	"AnswerCallFailed" : "AnswerCallFailed",
	"MonitorControlSucc" : "MonitorControlSucc",
	"MonitorControlFailed" : "MonitorControlFailed",
	"InterveneSucc":"InterveneSucc",
	"InterveneFailed":"InterveneFailed",
	"InterceptSucc":"InterceptSucc",
	"InterceptFailed":"InterceptFailed",
	"ForceDropSucc":"ForceDropSucc",
	"ForceDropFailed":"ForceDropFailed",

	// "======"主动事件"======"
	"WebSocketReplaced" : "WebSocketReplaced",
	"SettingsNotify" : "SettingsNotify",
	"StateChange" : "StateChange",
	"WorkModeChange" : "WorkModeChange",
	"QueueChange" : "QueueChange",
	"CallArrive" : "CallArrive",
	"DialBegin" : "DialBegin",
	"DialSucc" : "DialSucc",
	"DialFailed" : "DialFailed",
	"DevConnected" : "DevConnected",
	"DevDisconnected" : "DevDisconnected",
	"ConsultedOver" : "ConsultedOver",
	"ConsultOver" : "ConsultOver",
	"ConfOver" : "ConfOver",
	"IVRCheckReturn" : "IVRCheckReturn",
	"WaitCallOver" : "WaitCallOver",
	"WrapupTick" : "WrapupTick",
	"HBSucc" : "HBSucc",
	"HBFailed" : "HBFailed",
	"MonitorContorled" : "MonitorContorled",

};

export var ESPError = {
	"Succ" : "Succ",
	"UnknownCommand" : "UnknownCommand",
	"InvalidIns" : "InvalidIns",
	"DelegatorIdNoMatch" : "DelegatorIdNoMatch",
	"ProcessFailed" : "ProcessFailed"
};

var EAgentListType = {
	"AGENTLISTTYPE_MONITOR" : "AGENTLISTTYPE_MONITOR", // 监听列表
	"AGENTLISTTYPE_CONSULT" : "AGENTLISTTYPE_CONSULT", // 咨询列表
	"AGENTLISTTYPE_CALLINNER" : "AGENTLISTTYPE_CALLINNER", // 内呼列表
	"AGENTLISTTYPE_AGENTMSG" : "AGENTLISTTYPE_AGENTMSG", // 文本聊天
	"AGENTLISTTYPE_TRANSFER" : "AGENTLISTTYPE_TRANSFER", // 转移列表
	"AGENTLISTTYPE_ALERTTRANSFER" : "AGENTLISTTYPE_ALERTTRANSFER",// 振铃转接列表
	"AGENTLISTTYPE_MONITORCONTROL" : "AGENTLISTTYPE_MONITORCONTROL",// 班长控制列表
	// 振铃转移列表

};

var ESPFunc = {
	"SPFunc_NULL" : 0, // 空白
	"SPFunc_LogOn" : 1, // 登录
	"SPFunc_LogOff" : 2, // 退出
	"SPFunc_DialOut" : 3, // 外拨
	"SPFunc_CallInner" : 4, // 内呼
	"SPFunc_Monitor" : 5, // 监听
	"SPFunc_Hold" : 6, // 保持
	"SPFunc_Consult" : 7, // 内部咨询
	"SPFunc_CallOut" : 8, // 外拨咨询
	"SPFunc_Investigate" : 9, // 满意度调查
	"SPFunc_DropCall" : 10, // 结束通话
	"SPFunc_Unhold" : 11, // 取回保持
	"SPFunc_CancelDialout" : 12, // 取消外拨
	"SPFunc_CancelConsult" : 13, // 取消咨询
	"SPFunc_FinishConsult" : 14, // 结束咨询
	"SPFunc_ConsultTransfer" : 15, // 咨询转接
	"SPFunc_HoldConsult" : 16, // 保持咨询
	"SPFunc_ConsultConf" : 17, // 咨询三方
	"SPFunc_FetchConsult" : 18, // 取回咨询
	"SPFunc_CancelCallout" : 19, // 取消外呼
	"SPFunc_HoldOutLine" : 20, // 保持外线
	"SPFunc_CalloutTransfer" : 21, // 求助转出
	"SPFunc_FinishCallout" : 22, // 结束求助
	"SPFunc_FetchOutline" : 23, // 取回外线
	"SPFunc_CancelMonitor" : 24, // 取消监听
	"SPFunc_ForceDrop" : 25, // 强拆
	"SPFunc_Intercept" : 26, // 强拦
	"SPFunc_Intervene" : 27, // 强插
	"SPFunc_FinishMonitor" : 28, // 结束监控
	"SPFunc_DropCustomer" : 29, // 挂断客户
	"SPFunc_DropAgent" : 30, // 挂断座席
	"SPFunc_FinishWrapup" : 31, // 完成
	"SPFunc_DropOutLine" : 32, // 挂断外线
	"SPFunc_Leave" : 33, // 离席
	"SPFunc_Resume" : 34, // 复席
	"SPFunc_CancelCallInner" : 35, // 取消内呼
	"SPFunc_SetWorkMode" : 36, // 工作模式
	"SPFunc_AgentMsg" : 37, // 座席消息
	"SPFunc_CancelPrepareDialing" : 38, // 取消外拨准备
	"SPFunc_CancelPrepareMonitor" : 39, // 取消监听准备
	"SPFunc_CancelPrepareCallInner" : 40, // 取消内呼准备
	"SPFunc_CalloutConf" : 41, // 外线三方
	"SPFunc_SoftHookOff" : 42, // 软摘机
	"SPFunc_CancelPreview" : 43, // 结束预览
	"SPFunc_PreviewDial" : 44, // 预览外拨
	"SPFunc_DeletePreview" : 45, // 删除预览任务
	"SPFunc_SkipDial" : 46, // 取消本次外拨
	"SPFunc_FinishNoneRealTimeWork" : 47, // 工作完成
	"SPFunc_FinishConf" : 48, // 结束会议
	"SPFunc_LeaveConf" : 49, // 退出会议
	"SPFunc_DropConfParty" : 50, // 挂断与会者
	"SPFunc_AgentMsgOn" : 51, // 座席消息
	"SPFunc_CancelWait" : 52, // 取消等待
	"SPFunc_AlertTransfer" : 53, // 振铃转移
	"SPFunc_PresetLeave" : 54, // 取消预离席
	"SPFunc_CancelPresetLeave" : 55, // 预离席
	"SPFunc_ConsultEx" : 56, // 咨询
	"SPFunc_TransferIVR" : 57, // 转接IVR
	"SPFunc_TransferOutLine" : 58, // 转接外线
	"SPFunc_TransferAgent" : 59, // 转接坐席
	"SPFunc_MuteMic" : 60, // 麦克禁音
	"SPFunc_UnmuteMic" : 61, // 麦克启用
	"SPFunc_ShowDialPad" : 62, // 拨号盘
	"SPFunc_ShowVolumnControl" : 63, // 音量控制
	"SPFunc_Config" : 64, // 配置
	"SPFunc_TransferToIVR" : 65, // 转接IVR
	"SPFunc_AnswerVideoConf" : 66, // 应答视频
	"SPFunc_FinishVideoConf" : 67, // 结束视频
	"SPFunc_MonitorControl" : 68, // 班长控制

};

var ESPState = {
	"AGENTSTATE_NULL" : 0, // 未连接
	"AGENTSTATE_INITIAL" : 1, // 初始化
	"AGENTSTATE_INITIALPHONE" : 2, // 检查电话
	"AGENTSTATE_IDLE" : 3, // 空闲
	"AGENTSTATE_TALKPREPAREPLAYWORKERID" : 4, // 通话准备(播放工号)
	"AGENTSTATE_TALKPREPARERINGING" : 5, // 通话准备(振铃)
	"AGENTSTATE_TALK" : 6, // 通话
	"AGENTSTATE_HOLD" : 7, // 保持
	"AGENTSTATE_DIALINPUTNUM" : 8, // 外拨准备(输入号码)
	"AGENTSTATE_DIALING" : 9, // 外拨中
	"AGENTSTATE_HOLD_CONSULTRINGING" : 10, // 咨询请求中（振铃）
	"AGENTSTATE_HOLD_CONSULT" : 11, // 咨询
	"AGENTSTATE_TALK_CONSULTHOLD" : 12, // 咨询保持
	"AGENTSTATE_HOLDCALLING" : 13, // 保持呼外线中
	"AGENTSTATE_HOLD_TALK" : 14, // 保持外线通话
	"AGENTSTATE_TALK_HOLD" : 15, // 通话保持外线
	"AGENTSTATE_MONITORSELECTAGENT" : 16, // 监听准备(选择座席)
	"AGENTSTATE_MONITORING" : 17, // 监听
	"AGENTSTATE_INTERVENECONF" : 18, // 会议
	"AGENTSTATE_WRAPUP" : 19, // 话后
	"AGENTSTATE_CONSULTED" : 20, // 被咨询
	"AGENTSTATE_CONSULTCONF" : 21, // 会议
	"AGENTSTATE_CALLOUTCONF" : 22, // 会议
	"AGENTSTATE_LEAVE" : 23, // 离席
	"AGENTSTATE_INNERDIALSELECTAGENT" : 24, // 内呼准备(选择座席)
	"AGENTSTATE_INNERDIALALERTING" : 25, // 内呼中(振铃)
	"AGENTSTATE_INNERTALK" : 26, // 内部通话
	"AGENTSTATE_TALKPREPARE_WAITRING" : 27, // 等待物理连接
	"AGENTSTATE_PREVIEWTASK" : 28, // 非实时业务
	"AGENTSTATE_NONEREALTIMEWORK" : 29, // 从属会议
	"AGENTSTATE_SLAVECONF" : 30, // 等待IVR认证
	"AGENTSTATE_IVRVERIFY" : 31, // 预览中
	"AGENTSTATE_ONESTEPTRANSFERING" : 32, // 转移中
	"AGENTSTATE_INOUTCOUPLE_CONSULT" : 33, // 咨询
	"AGENTSTATE_NODEV_ONLINE" : 34, // 在线
	"AGENTSTATE_HOLD_CONSULT_INCONF" : 35, // 会议咨询
	"AGENTSTATE_CONSULT_SWAPING" : 36, // 咨询切换
	"AGENTSTATE_CONSULT_SWAPING_BACK" : 37, // 咨询切换
	"AGENTSTATE_CONSULTED_HOLD" : 38, // 被保持
	"AGENTSTATE_HOLD_TALK_SWAPING" : 39, // 外线切换
	"AGENTSTATE_TALK_HOLD_SWAPING_BACK" : 40, // 外线切换
	"AGENTSTATE_INNER_HOLD" : 41, // 内呼保持
	"AGENTSTATE_INNER_HELD" : 42, // 内呼被保持
	"AGENTSTATE_TRANSFERED_DIALING" : 43, // 外拨中转接
	"AGENTSTATE_ALERT_TRANSFER" : 44, // 振铃转接
	"AGENTSTATE_ADCDIALOUT_WAITING" : 45, // 动态主叫外拨中
	"AGENTSTATE_DIAL_WAIT_ALERTBACK" : 46, // 等待回振
	"AGENTSTATE_DIAL_ALERTBACK" : 47, // 等待回振
	"AGENTSTATE_CALLINNER_WAIT_ALERTBACK" : 48, // 回振中
	"AGENTSTATE_CALLINNER_ALERTBACK" : 49, // 回振中
	"AGENTSTATE_CONSULT_QUEUE" : 50, // 咨询排队
	"AGENTSTATE_VCONF_WAITANSWER" : 51, // 视频会议等待服务
	"AGENTSTATE_VCONF_ANSWERED " : 52, // 坐席应答
	"AGNETSTATE_VCONF_INCONF " : 53, // 会议

};

/**
 * 命令对象
 */
export function SPCommand(wssoftphone, ecommand, ins, delegatorId) {
	/**
	 * 命令枚举值
	 */
	this.command = ecommand;
	this.objectClass = "SPCommand";
	if (wssoftphone) {
		this.delegatorId = wssoftphone.delegatorId;
		this.ins = wssoftphone.ins;
	} else {
		this.delegatorId = delegatorId;
		this.ins = ins;
	}
	/**
	 * 命令参数，以KeyValue的方式存储，实际参数需要参考具体的API定义
	 */
	this.params = {};

}

/**
 * 设定命令参数
 */
SPCommand.prototype.pushParams = function(key, value) {
	this.params[key] = value;
};

SPCommand.prototype.toString = function() {
	return JSON.stringify(this);
};

/**
 * 转接IVR的参数
 */
export function SPTransferIVRInfo() {
	/**
	 * IVR流程接入码
	 */
	this.svn = "";
	/**
	 * 是否为密码认证流程
	 */
	this.checkPassword = false;
	/**
	 * 命令参数，以KeyValue的方式存储，实际参数需要参考具体的API定义
	 */
	this.params = {};
}

SPTransferIVRInfo.prototype.pushParams = function(key, value) {
	this.params[key] = value;
};

SPTransferIVRInfo.prototype.toString = function() {
	return JSON.stringify(this);
};

/**
 * OneStepTransfer Class 单步转接参数
 */
export function SPOneStepTransferInfo() {
	/**
	 * 转接目标，支持AGT\EXT\OUT\SK
	 */
	this.destType = "";
	/**
	 * 目标实例，对应类型的实例、分机号、外线号码、技能
	 */
	this.destIns = "";
	/**
	 * 命令参数，以KeyValue的方式存储，实际参数需要参考具体的API定义
	 */
	this.params = {};
}

SPOneStepTransferInfo.prototype.pushParams = function(key, value) {
	this.params[key] = value;
};

SPOneStepTransferInfo.prototype.toString = function() {
	return JSON.stringify(this);
};

export function EmployeeSkill() {
	this.id;
	this.skillCode;
	this.skillLevel;
}

export function CustomInitParms() {
	this.agentWrapupSeconds;
	this.skills = [];
}

CustomInitParms.prototype.addSkill = function(skillCode, skillLevel) {
	var sk = new EmployeeSkill();
	sk.skillCode = skillCode;
	sk.skillLevel = skillLevel;
	this.skills.push(sk);
};

export function WSLocalLogger() {
	this.maxCount = 1000;
	this.startIndex = 1;
	this.stopIndex = 0;

	var idxStart = localStorage.getItem("WSLog.start");
	if (idxStart) {
		this.startIndex = parseInt(idxStart);
	}
	var idxStop = localStorage.getItem("WSLog.stop");
	if (idxStop) {
		this.stopIndex = parseInt(idxStop);
	}
}

WSLocalLogger.prototype.writeLog = function(info) {
	if (this.stopIndex - this.startIndex >= this.maxCount) {
		this.clearOldLogTo(this.maxCount * 0.8);
	}
	this.stopIndex++;
	localStorage.setItem("WSLog.l" + this.stopIndex, new Date()
			.toLocaleString()
			+ " " + info);
	localStorage.removeItem("WSLog.stop");
	localStorage.setItem("WSLog.stop", this.stopIndex);
};

/**
 * 清理旧日志，仅保存指定条数
 * 
 * @param count
 *            指定条数
 */
WSLocalLogger.prototype.clearOldLogTo = function(count) {

	var x = this.stopIndex - this.startIndex - count;
	if (x <= 0)
		return;

	for (var i = 0; i <= x; i++) {
		localStorage.removeItem("WSLog.l" + (this.startIndex + i));
	}
	this.startIndex = this.startIndex + x;
	// 全部清除，复位为起始状态
	if (count == 0) {
		this.startIndex = 1;
		this.stopIndex = 0;
	}
	localStorage.removeItem("WSLog.start");
	localStorage.setItem("WSLog.start", this.startIndex);

	localStorage.removeItem("WSLog.stop");
	localStorage.setItem("WSLog.stop", this.stopIndex);
};

WSLocalLogger.prototype.getTextLogs = function() {
	var logInfo = "WSLog" + new Date().toLocaleString() + "\r\n";

	for (var i = this.startIndex; i <= this.stopIndex; i++) {
		logInfo += localStorage.getItem("WSLog.l" + i) + "\r\n";
	}
	return logInfo;
};
WSLocalLogger.prototype.getHTMLLogs = function() {
	var logInfo = "WSLog" + new Date().toLocaleString() + "<br>";

	for (var i = this.startIndex; i <= this.stopIndex; i++) {
		logInfo += localStorage.getItem("WSLog.l" + i) + "<br>";
	}
	return logInfo;
};

//function IVRButton() {
//	this.svn = "";
//	this.name = "";
//	this.checkPassword = false;
//}
//
//IVRButton.prototype.parse = function(buttonstr) {
//	//999,满意度调查
//	if (!buttonstr || buttonstr == "") {
//		return false;
//	}
//
//	var strs = buttonstr.split(',');
//	if (strs.length < 2) {
//		return false;
//	}
//	this.svn = strs[0];
//	this.name = strs[1];
//	this.checkPassword = false;
//	if(strs.length >=3){
//		if(strs[2] == "1"){
//			this.checkPassword = true;
//		}
//	}
//	return true;
//}
//
//function IVRButtonSetting() {
//	this.supported = false;
//	this.buttons = [];
//}
//
//IVRButtonSetting.prototype.parseSetting = function(ivrButtonSetting) {
//	// [999,满意度调查[|888,满意度调查2]]
//	this.supported = false;
//	this.buttons = [];
//	if (!ivrButtonSetting) {
//		return false;
//	}
//
//	var strs = ivrButtonSetting.split("|");
//	if (strs.length == 0) {
//		return false;
//	}
//
//	for (var i = 0; i < strs.length; i++) {
//		var btn = new IVRButton();
//		if (btn.parse(strs[i])) {
//			this.buttons.push(btn);
//		}
//	}
//
//	if (this.buttons.length > 0) {
//		return true;
//	} else {
//		return false;
//	}
//}

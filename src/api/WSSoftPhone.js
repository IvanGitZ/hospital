import { SPCommand, ESPCommand, ESPAttr, ESPError, ESPEvent } from './SPCommand'
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(str) {
		var reg = new RegExp("^" + str);
		return reg.test(this);
	};
}

if (typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(str) {
		var reg = new RegExp(str + "$");
		return reg.test(this);
	};
}
/**
 * WSSoftPhone软电话对象 attrs:初始化属性 eventHandler:事件回调函数集
 */
function WSSoftPhone(attrs, eventHandler) {
	//var self = this;
	this.eventHandler = eventHandler;
	// WS服务器地址
	this.serverUri = "";
	// WS服务器地址2,默认为空字符串，代表不启用
	this.serverUri2 = "";
	
	// 与BC系统的会话标识
	this.session = "";
	// 坐席实例，通常为分机号
	this.ins = "6001";
	// 坐席工号
	this.agentId = "999";
	// 坐席姓名
	this.agentName = "DemoAgent";
	// 坐席技能
	this.agentSK = "1001";
	// 坐席状态
	this.agentState = "0";
	//离席原因
	this.leaveReason= "0";
	// 是否班长席
	this.isMonitor = false;
	// 管理部门 1,2,3
	this.monitorDepts = "";
	// SoftPhoneCode
	this.softPhoneCode = "";
	// 初始化参数
	this.customInitParams = null;
	// 代理Id，在登录时获取，后续操作均需要使用改命令
	this.delegatorId = "";
	this.coInfos = {};
	this.queueList = {};
	// 临时呼叫属性，在转接时可以设置
	this.tempCOInfos = {};
	// 状态按钮设置
	this.stateSettings = null;
	// 工作模式设置
	this.workModeSettings = null;
	// 离席原因设置
	this.leaveReasonSettings = null;
	// 转接下来选项
	this.transferSubItems = null;
	// 转接IVR
	this.transferIVRInfo = null;
	// 转接坐席技能
	this.transferAgentSkillInfo = null;
	// IVR快捷按钮
	this.ivrButtonSettings = null;

	//自动应答设置
	this.canAutoAnswer = false;
	this.isAnutoAnswer = false;
	
	// 是否支持保持登录
	this.canKeepLogon = false;
	// 当前是否保持登录
	this.isKeepLogon = false;
	// 是否正在连接Server
	this.isConnectingServer = false;
	this.Logger = null;

	if (attrs) {
		if (attrs.stateSettings) {
			this.stateSettings = attrs.stateSettings;
		}
		if (attrs.workModeSettings) {
			// 自定义工作模式
			this.workModeSettings = attrs.workModeSettings;
		}
		if (attrs.leaveReasonSettings) {
			// 自定义离席原因
			this.leaveReasonSettings = attrs.leaveReasonSettings;
		}

		if (attrs.customInitParams) {
			this.customInitParams = attrs.customInitParams;
		}
		if (attrs.serverUri) {
			this.serverUri = attrs.serverUri;
		}
		if(attrs.serverUri2){
			this.serverUri2 = attrs.serverUri2;
		}
		if (attrs.ins) {
			this.ins = attrs.ins;
		}
		if (attrs.agentId) {
			this.agentId = attrs.agentId;
		}
		if (attrs.agentName) {
			this.agentName = attrs.agentName;
		}
		if(attrs.isAutoAnswer){
			this.isAnutoAnswer = attrs.isAutoAnswer;
		}
		if(attrs.softPhoneCode){
			this.softPhoneCode = attrs.softPhoneCode;
		}
		if (attrs.delegatorId) {
			this.delegatorId = attrs.delegatorId;
		}
		if (attrs.saveLocalLog) {
			if (attrs.saveLocalLog == true || attrs.saveLocalLog == "true") {
				this.Logger = new WSLocalLogger();
			}
		}
	}
}

// 获取当前状态的集合
WSSoftPhone.prototype.getStateSetting = function() {
	var _wssp = this;
	if (_wssp.stateSettings) {
		for (var i = 0; i < _wssp.stateSettings.length; i++) {
			if (_wssp.stateSettings[i].state == this.agentState) {
				return _wssp.stateSettings[i];
			}
		}
	}
	return null;
};

/**
 * 连接WebSocket Server
 * 
 * @param serverUri
 *            WebSocket地址
 */
WSSoftPhone.prototype.connectServer = function(serverUri) {
	var _wssp = this;
	_wssp.isConnectingServer = true;
	// 如果传递了URL则使用，否则使用构造参数中的地址
	if (serverUri) {
		_wssp.serverUri = serverUri;
	}
	_wssp.ws = new WebSocket(_wssp.serverUri);
	//检查双serverUri设置，如果支持，对调地址属性
	_wssp.switchServerUri();
	
	_wssp.ws.onopen = function() {
		// 复位连接标志
		_wssp.isConnectingServer = false;
		_wssp.writeLog("WebSocket#onopen");
		_wssp.showTip("WebSocket已连接！");
		if (_wssp.eventHandler.onWSOpen) {
			_wssp.eventHandler.onWSOpen.call(_wssp);
		}
		_wssp.checkWebSocket();
	};
	_wssp.ws.onmessage = function(e) {
		if (e.data && e.data != "") {
			// 判断为消息对象
			if (e.data.startsWith("{")) {
				var msg = JSON.parse(e.data);
				if (msg.objectClass) {
					if (msg.objectClass == "SPEvent") {
						_wssp.processEvent(msg);
					} else if (msg.objectClass == "SPResponse") {
						_wssp.processResponse(msg);
					} else {
						_wssp.trace("unknow msg:" + e.data);
					}
				} else {
					_wssp.eventHandler.onTrace(_wssp, e.data);
				}
			}
		}
	};
	_wssp.ws.onclose = function() {
		_wssp.writeLog("WebSocket#onclose");
		_wssp.showTip("WebSocket已关闭！");
		_wssp.ws = null;

		if (_wssp.eventHandler.onWSClose) {
			_wssp.eventHandler.onWSClose.call(_wssp);
		}
		// 补充上报连接失败事件
		if (_wssp.isConnectingServer) {
			_wssp.isConnectingServer = false;
			if (_wssp.eventHandler.onWSConnectFailed) {
				_wssp.showTip("连接Server失败！");
				_wssp.eventHandler.onWSConnectFailed.call(_wssp);
			}
		}
	};
};

/***
 * 检查双serverUri设置，如果支持，对调地址属性
 */
WSSoftPhone.prototype.switchServerUri = function() {
	if( this.serverUri2 && this.serverUri2 != ""){
		var uri = this.serverUri;
		this.serverUri = this.serverUri2;
		this.serverUri2 = uri;
		this.trace("set serverUri=" + this.serverUri + " for next connectServer");
	}
};

/**
 * 处理事件通知
 * 
 * @param evt
 *            事件对象
 */
WSSoftPhone.prototype.processEvent = function(evt) {
	var _wssp = this;
	if (evt.ins != this.ins) {
		this.trace("Ins not match!!!!");
		return;
	}

	if (evt.event == ESPEvent.SettingsNotify) {
		_wssp.writeLog("ESPEvent.SettingsNotify");
		// 设置按钮配置，同时触发状态改变来更新UI
		_wssp.stateSettings = eval(evt.params.stateSettings);
		if (!_wssp.workModeSettings) {
			// 未设置自定义工作模式，更新为标准工作模式
			_wssp.workModeSettings = eval(evt.params.workModeSettings);
		}
		if (!_wssp.leaveReasonSettings) {
			// 未设置自定义离席原因，更新为标准离席原因
			_wssp.leaveReasonSettings = eval(evt.params.leaveReasonSettings);
		}

		// 转接下拉选项
		this.transferSubItems = eval(evt.params.transferSubItems);
		// 转接IVR
		this.transferIVRInfo = eval(evt.params.transferIVRInfo);
		// 转接坐席技能
		this.transferAgentSkillInfo = eval(evt.params.transferAgentSkillInfo);
		// IVR快捷按钮
		this.ivrButtonSettings = eval(evt.params.ivrButtonSettings);

		_wssp.notifySettings();
		_wssp.notifyStateChange(this.agentState);

	} else if (evt.event == ESPEvent.StateChange) {
		var st = evt.agentInfos.agentState;
		// 签出后状态保持为1，可以执行签入操作
		if (st == "0") {
			st = "1";
		}
		_wssp.agentState = st;
		_wssp.agentWorkMode = evt.agentInfos.agentWorkMode;
		// 空闲时清空呼叫信息
		if (st == "3") {
			_wssp.coInfos = {};
			_wssp.tempCOInfos = {};
		}
		_wssp.notifyStateChange(this.agentState);
	} else if (evt.event == ESPEvent.WorkModeChange) {
		var st = evt.agentInfos.agentState;
		// 签出后状态保持为1，可以执行签入操作
		if (st == "0") {
			st = "1";
		}
		_wssp.agentState = st;
		_wssp.agentWorkMode = evt.agentInfos.agentWorkMode;
		_wssp.eventHandler.onWorkModeChange.call(_wssp, _wssp.agentWorkMode);
	} else if (evt.event == ESPEvent.QueueChange) {
		// 转换为Json对象，需要增加括号
		_wssp.queueList = eval(evt.params.queueList);
		if (_wssp.eventHandler.onQueueChange) {
			_wssp.eventHandler.onQueueChange.call(_wssp, _wssp.queueList);
		}
	} else if (evt.event == ESPEvent.CallArrive) {
		_wssp.writeLog("ESPEvent.CallArrive:" + JSON.stringify(evt.coInfos));
		_wssp.coInfos = evt.coInfos;
		_wssp.showTip("电话振铃中...");

		if(_wssp.canAutoAnswer == true && _wssp.isAnutoAnswer == true){
			setTimeout(function() {
				_wssp.trace("autoAnswer...");
				_wssp.answerCall();
			}, 200);
		}
		
		if (_wssp.eventHandler.onCallArrive) {
			_wssp.eventHandler.onCallArrive.call(_wssp, evt.coInfos);
		}
		
		
	} else if (evt.event == ESPEvent.LogonSucc) {
		_wssp.writeLog("ESPEvent.LogonSucc");
		_wssp.showTip("登录成功");
		_wssp.checkMonitor(evt.agentInfos);
		_wssp.checkKeepLogon(evt.agentInfos);
		_wssp.checkAutoAnswer(evt.agentInfos);
		if (_wssp.eventHandler.onLogonSucc) {
			_wssp.eventHandler.onLogonSucc.call(_wssp, evt.ins);
		}
	} else if (evt.event == ESPEvent.LogoffSucc) {
		_wssp.writeLog("ESPEvent.LogoffSucc");
		_wssp.showTip("签出成功");
		if (_wssp.eventHandler.onLogoffSucc) {
			_wssp.eventHandler.onLogoffSucc.call(_wssp, evt.ins);
		}
	} else if (evt.event == ESPEvent.LogonFailed) {
		_wssp.writeLog("ESPEvent.LogonFailed(" + evt.errorCode + "):"
				+ evt.errorDesc);
		_wssp.showTip("登录失败(" + evt.errorCode + "):" + evt.errorDesc);
		if (_wssp.eventHandler.onLogonFailed) {
			_wssp.eventHandler.onLogonFailed.call(_wssp, evt.ins,
					evt.errorCode, evt.errorDesc);
		}
	} else if (evt.event == ESPEvent.PrepareDialSucc) {
		if (_wssp.eventHandler.onPrepareDialSucc) {
			_wssp.eventHandler.onPrepareDialSucc.call(_wssp);
		}
	} else if (evt.event == ESPEvent.LeaveSucc) {
		_wssp.showTip("离席成功");
	} else if (evt.event == ESPEvent.ResumeWorkSucc) {
		_wssp.showTip("复席成功");
	} else if (evt.event == ESPEvent.PrepareDialFailed) {
		_wssp.showTip("准备外拨失败(" + evt.errorCode + "):" + evt.errorDesc);
	} else if (evt.event == ESPEvent.DevConnected) {
		_wssp.showTip("开始通话");
		if (_wssp.eventHandler.onDevConnected) {
			_wssp.eventHandler.onDevConnected.call(_wssp);
		}
	} else if (evt.event == ESPEvent.DevDisconnected) {
		_wssp.showTip("通话结束");
		if (_wssp.eventHandler.onDevDisconnected) {
			_wssp.eventHandler.onDevDisconnected.call(_wssp);
		}
	} else if (evt.event == ESPEvent.DialBegin) {

		_wssp.writeLog("ESPEvent.DialBegin:" + JSON.stringify(evt.coInfos));
		_wssp.coInfos = evt.coInfos;
		_wssp.showTip("外拨开始");
		if (_wssp.eventHandler.onDialBegin) {
			_wssp.eventHandler.onDialBegin.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.DialSucc) {
		_wssp.coInfos = evt.coInfos;
		_wssp.showTip("外拨成功");
		if (_wssp.eventHandler.onDialSucc) {
			_wssp.eventHandler.onDialSucc.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.DialFailed) {
		_wssp.showTip("外拨失败");
		if (_wssp.eventHandler.onDialFailed) {
			var errorCode = evt.errorCode;
			_wssp.eventHandler.onDialFailed.call(_wssp, errorCode);
		}
	} else if (evt.event == ESPEvent.WebSocketReplaced) {
		_wssp.showTip("软电话被顶替！！！");
		if (_wssp.eventHandler.onWebSocketReplaced) {
			_wssp.eventHandler.onWebSocketReplaced();
		}
	} else if (evt.event == ESPEvent.HoldSucc) {
		_wssp.showTip("保持成功");
	} else if (evt.event == ESPEvent.HoldFailed) {
		_wssp.showTip("保持失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.FetchHoldSucc) {
		_wssp.showTip("取保持成功");
	} else if (evt.event == ESPEvent.FetchHoldFailed) {
		_wssp.showTip("取保持失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.ConsultStart) {
		_wssp.coInfos = evt.coInfos;
		_wssp.showTip("开始咨询");
		if (_wssp.eventHandler.onConsultStart) {
			_wssp.eventHandler.onConsultStart.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.ConsultFailed) {
		_wssp.coInfos = evt.coInfos;
		_wssp.showTip("咨询失败:" + evt.errorCode);
		if (_wssp.eventHandler.onConsultFailed) {
			_wssp.eventHandler.onConsultFailed.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.ConsultSucc) {
		_wssp.showTip("咨询成功");
		_wssp.coInfos = evt.coInfos;
		if (_wssp.eventHandler.onConsultSucc) {
			_wssp.eventHandler.onConsultSucc.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.ConsultOver) {
		_wssp.showTip("咨询结束");
		_wssp.coInfos = evt.coInfos;
		if (_wssp.eventHandler.onConsultOver) {
			_wssp.eventHandler.onConsultOver.call(_wssp, evt.coInfos);
		}
	} else if (evt.event == ESPEvent.CancelConsultSucc) {
		_wssp.showTip("取消咨询成功");
	} else if (evt.event == ESPEvent.CancelConsultFailed) {
		_wssp.showTip("取消咨询失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.FinishConsultSucc) {
		_wssp.showTip("结束咨询成功");
	} else if (evt.event == ESPEvent.FinishConsultFailed) {
		_wssp.showTip("结束咨询失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.ConsultTransferSucc) {
		_wssp.showTip("咨询转接成功");
	} else if (evt.event == ESPEvent.ConsultTransferFailed) {
		_wssp.showTip("咨询转接失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.PrepareCallInnerSucc) {
		_wssp.showTip("内呼准备成功");
		// 准备成功后，主动刷新内呼列表
		_wssp.refreshCallInnerAgentList();
	} else if (evt.event == ESPEvent.PrepareCallInnerFailed) {
		_wssp.showTip("内呼准备失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.CancelPrepareCallInnerSucc) {
		_wssp.showTip("取消内呼准备成功");
	} else if (evt.event == ESPEvent.CancelPrepareCallInnerFailed) {
		_wssp.showTip("取消内呼准备失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.RefreshAgentListSucc) {
		// 转换为Json对象，需要增加括号
		var agentList = eval("(" + evt.params.agentList + ")");
		_wssp.processAgentListEvent(agentList);
	} else if (evt.event == ESPEvent.PrepareMonitorSucc) {
		_wssp.showTip("准备监听成功");
		// 准备成功后，主动刷新内呼列表
		_wssp.refreshMonitorAgentList();
	} else if (evt.event == ESPEvent.TransferBegin) {
		_wssp.showTip("开始转接");
	} else if (evt.event == ESPEvent.TransferSucc) {
		_wssp.showTip("转接成功");
	} else if (evt.event == ESPEvent.TransferFailed) {
		_wssp.showTip("转接失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.OneStepTransferBegin) {
		_wssp.showTip("开始转接");
	} else if (evt.event == ESPEvent.OneStepTransferSucc) {
		_wssp.showTip("转接成功");
	} else if (evt.event == ESPEvent.OneStepTransferFailed) {
		_wssp.showTip("转接失败:" + evt.errorCode);
		if (_wssp.eventHandler.onOneStepTransferFailed) {
			_wssp.eventHandler.onOneStepTransferFailed.call(_wssp,
					evt.errorCode);
		}
	} else if (evt.event == ESPEvent.IVRCheckReturn) {
		_wssp.showTip("IVR验证返回");
		if (_wssp.eventHandler.onIVRCheckReturn) {
			_wssp.eventHandler.onIVRCheckReturn.call(_wssp);
		}
	} else if (evt.event == ESPEvent.WaitCallOver) {
		_wssp.showTip("IVR验证呼叫释放");
		if (_wssp.eventHandler.onWaitCallOver) {
			_wssp.eventHandler.onWaitCallOver.call(_wssp);
		}
	} else if (evt.event == ESPEvent.CancelWaitSucc) {
		_wssp.showTip("取消IVR验证等待成功");
	} else if (evt.event == ESPEvent.CancelWaitFailed) {
		_wssp.showTip("取消IVR验证等待失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.WrapupTick) {
		_wssp.showTip("话后完成倒计时:" + evt.params.tick);
	} else if (evt.event == ESPEvent.FinishWrapupSucc) {
		_wssp.showTip("话后完成成功");
	} else if (evt.event == ESPEvent.DropCallSucc) {
		_wssp.showTip("结束命令已发送");
	} else if (evt.event == ESPEvent.DropCallFailed) {
		_wssp.showTip("结束通话失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.CancelDialSucc) {
		_wssp.showTip("取消外拨成功");
	} else if (evt.event == ESPEvent.CancelDialFailed) {
		_wssp.showTip("取消外拨失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.AnswerCallSucc) {
		_wssp.showTip("开始软摘机");
	} else if (evt.event == ESPEvent.AnswerCallFailed) {
		_wssp.showTip("软摘机失败:" + evt.errorCode);
	} else if (evt.event == ESPEvent.MonitorControlSucc) {
		var tip = "班长控制成功";
		var destAgent = "";
		if (evt.params.destSPName) {
			destAgent = evt.params.destSPName;
		}
		if (evt.params.controlType && evt.params.extraControlParam) {
			tip = destAgent
					+ _wssp.getControlTypeName(evt.params.controlType,
							evt.params.extraControlParam) + "成功";
		}
		_wssp.showTip(tip);
	} else if (evt.event == ESPEvent.MonitorControlFailed) {
		var tip = "班长控制失败:";
		var destAgent = "";
		if (evt.params.destSPName) {
			destAgent = evt.params.destSPName;
		}
		if (evt.params.controlType) {
			tip = destAgent
					+ _wssp.getControlTypeName(evt.params.controlType, "")
					+ "失败：";
		}
		_wssp.showTip(tip + evt.errorCode);
	} else if (evt.event == ESPEvent.MonitorContorled) {
		var tip = "本坐席被班长控制";
		var destAgent = "";
		if (evt.params.destSPName) {
			destAgent = evt.params.destSPName;
		}
		if (evt.params.controlType) {
			tip = "本坐席被班长(" + destAgent + ")"
					+ _wssp.getControlTypeName(evt.params.controlType, "");
		}
		_wssp.showTip(tip);
	} else if (evt.event == ESPEvent.InterceptSucc) {
		_wssp.showTip("强拦成功");
		if (_wssp.eventHandler.onInterceptSucc) {
			_wssp.eventHandler.onInterceptSucc.call(_wssp);
		}
	} else if (evt.event == ESPEvent.InterveneSucc) {
		_wssp.showTip("强插成功");
		if (_wssp.eventHandler.onInterveneSucc) {
			_wssp.eventHandler.onInterveneSucc.call(_wssp);
		}
	} else if (evt.event == ESPEvent.ForceDropSucc) {
		_wssp.showTip("强拆成功");
		if (_wssp.eventHandler.onForceDropSucc) {
			_wssp.eventHandler.onForceDropSucc.call(_wssp);
		}
	}

	// 转发给给订阅者进行二次处理
	if (_wssp.onEvent) {
		_wssp.onEvent.call(_wssp, evt);
	}

};

WSSoftPhone.prototype.getControlTypeName = function(controlType, controlParam) {
	// ControlType 0-监听 1、强制签出；2、强制离席；3:强制复席;4：强制话后完成 5:强制设置工作模式
	if (controlType == "1") {
		return "强制签出";
	} else if (controlType == "2") {
		return "强制离席";
	} else if (controlType == "3") {
		return "强制复席";
	} else if (controlType == "4") {
		return "强制完成话后";
	} else if (controlType == "5") {
		return "设置工作模式";
	} else {
		return "未知操作";
	}
};

WSSoftPhone.prototype.processAgentListEvent = function(agentList) {
	var _wssp = this;
	// 统一回调接口
	_wssp.showTip("刷新坐席列表成功");
	if (_wssp.eventHandler.onRefreshAgentListSucc) {
		_wssp.eventHandler.onRefreshAgentListSucc(agentList);
	}
	// //按照类型提供不同的回调接口
	// if (agentList.agentListType == EAgentListType.AGENTLISTTYPE_CONSULT) {
	// _wssp.showTip("刷新监控坐席列表成功");
	// if (_wssp.eventHandler.onRefreshConsultAgentListSucc) {
	// _wssp.eventHandler.onRefreshConsultAgentListSucc(agentList);
	// }
	// } else if (agentList.agentListType ==
	// EAgentListType.AGENTLISTTYPE_CALLINNER) {
	// _wssp.showTip("刷新内呼坐席列表成功");
	// if (_wssp.eventHandler.onRefreshCallInnerAgentListSucc) {
	// _wssp.eventHandler.onRefreshCallInnerAgentListSucc(agentList);
	// }
	// } else if (agentList.agentListType ==
	// EAgentListType.AGENTLISTTYPE_MONITOR) {
	// _wssp.showTip("刷新监控坐席列表成功");
	// if (_wssp.eventHandler.onRefreshMonitorAgentListSucc) {
	// _wssp.eventHandler.onRefreshMonitorAgentListSucc(agentList);
	// }
	// } else {
	// _wssp.showTip("刷新坐席列表成功");
	// if (_wssp.eventHandler.onRefreshAgentMsgAgentListSucc) {
	// _wssp.eventHandler.onRefreshAgentMsgAgentListSucc(agentList);
	// }
	// }
};

/**
 * 处理Server响应
 * 
 * @param resp
 *            回复响应
 */
WSSoftPhone.prototype.processResponse = function(resp) {
	var _wssp = this;
	if (resp.errorCode != ESPError.Succ) {
		_wssp.writeLog(resp.command + "错误:" + resp.errorCode);
		_wssp.showTip(resp.command + "错误:" + resp.errorCode);
		return;
	}
	// 处理个别需要响应的
	if (resp.command == ESPCommand.CheckWebSocket) {
		if (!resp.datas.isWebSocketExists) {
			_wssp.init();
		} else {
			// 提交确认事件
			if (_wssp.eventHandler.onConfirmReplaceWebSocket) {
				_wssp.eventHandler.onConfirmReplaceWebSocket.call(_wssp);
			} else {
				// 直接替换
				_wssp.init();
			}
		}
	} else if (resp.command == ESPCommand.Init) {
		_wssp.delegatorId = resp.datas.delegatorId;
		_wssp.writeLog("init get delegatorId:" + _wssp.delegatorId);
		_wssp.writeLog(JSON.stringify(resp.datas));

		if (_wssp.eventHandler.onInited) {
			_wssp.eventHandler.onInited.call(_wssp, _wssp.delegatorId);
		}
		_wssp.agentState = resp.datas.agentState;
		if (_wssp.agentState == "0") {
			_wssp.agentState = "1";
		}
		_wssp.agentWorkMode = resp.datas.agentWorkMode;
		_wssp.trace("init state:" + _wssp.agentState);
		_wssp.notifyStateChange(this.agentState);

		_wssp.checkKeepLogon(resp.agentInfos);

	} else if (resp.command == ESPCommand.Logon) {
		_wssp.delegatorId = resp.datas.delegatorId;
		_wssp.trace("logon get delegatorId:" + _wssp.delegatorId);
	} else if (resp.command == ESPCommand.RebindSocket) {
		_wssp.trace("RebindSocket 响应！！！");
	} else if (resp.command == ESPCommand.SetFunctionSwitch) {
		if (resp.errorCode == ESPError.Succ) {
			// 返回正确
			if (resp.datas && resp.datas.functionCode && resp.datas.isOn) {
				_wssp.notifyFunctionSwitch(resp.datas.functionCode, true,
						resp.datas.isOn == "true");
				_wssp.showTip("设置功能开关成功");
			}
		} else {
			_wssp.showTip("设置功能开关失败(" + resp.errorCode + "):" + resp.errorDesc);
		}
	} else if (resp.command == ESPCommand.WSHello) {
		_wssp.onWSHello(resp);
	}

};

/**
 * 关闭WebSocket连接
 */
WSSoftPhone.prototype.close = function() {
	if (this.ws) {
		this.ws.close();
	}
};
/**
 * 判断WebSocket状态
 * 
 * @returns {Boolean} 正常返回true
 */
WSSoftPhone.prototype.isReady = function() {
	if (this.ws && this.ws.readyState == this.ws.OPEN) {
		return true;
	} else {
		this.trace("websocket no ready");
		return false;
	}
};

/**
 * 检查连接,确认是否有已存在连接
 */
WSSoftPhone.prototype.checkWebSocket = function() {
	this.writeLog(this.agentId + " init");
	var cmd = new SPCommand(this, ESPCommand.CheckWebSocket);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams("agentName", this.agentName);
	cmd.pushParams("delegatorId", this.delegatorId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 初始化，连接Server后获取初始化信息
 */
WSSoftPhone.prototype.init = function() {
	this.writeLog(this.agentId + " init");
	var cmd = new SPCommand(this, ESPCommand.Init);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.agentName, this.agentName);
	cmd.pushParams(ESPAttr.delegatorId, this.delegatorId);
	// 设置初始化参数
	if (this.customInitParams) {
		cmd.pushParams(ESPAttr.customInitParams, JSON
				.stringify(this.customInitParams));
	}
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 签入Server
 */
WSSoftPhone.prototype.logon = function() {
	this.writeLog(this.agentId + " logon");
	var cmd = new SPCommand(this, ESPCommand.Logon);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams("agentName", this.agentName);
	cmd.pushParams("agentWorkMode", this.agentWorkMode);
	cmd.pushParams(ESPAttr.softPhoneCode,  this.softPhoneCode);
	// 设置初始化参数
	if (this.customInitParams) {
		cmd.pushParams(ESPAttr.customInitParams, JSON.stringify(this.customInitParams));
	}
	// alert(cmd.toString());
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 签出Server
 */
WSSoftPhone.prototype.logoff = function() {
	this.writeLog(this.agentId + " logoff!");

	var cmd = new SPCommand(this, ESPCommand.Logoff);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	// alert(cmd.toString());
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}

};

/**
 * 设置工作模式
 * 
 * @param wkmd
 *            目标工作模式
 */
WSSoftPhone.prototype.setWorkMode = function(wkmd) {
	this.trace(this.agentId + " setWorkMode " + wkmd);
	this.agentWorkMode = wkmd;
	//判断是否已经登录
	if( this.agentState == "0" || this.agentState == "1"){
		//未登录，进行工作模式预设
		this.eventHandler.onWorkModeChange.call(this, this.agentWorkMode);
		return;
	}
	
	//发送工作模式设置
	var cmd = new SPCommand(this, ESPCommand.SetWorkMode);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams("workMode", wkmd);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 调用指定功能按钮
 * 
 * @param funcId
 *            功能值
 */
WSSoftPhone.prototype.callSPFunction = function(funcId) {
	var _wssp = this;
	_wssp.writeLog(_wssp.agentId + " callSPFunction(" + funcId + ")");
	switch (funcId) {
	case ESPFunc.SPFunc_LogOn:
		_wssp.logon();
		break;
	case ESPFunc.SPFunc_LogOff:
		_wssp.logoff();
		break;
	case ESPFunc.SPFunc_DialOut:
		_wssp.prepareDial();
		break;
	case ESPFunc.SPFunc_CancelPrepareDialing:
		_wssp.cancelPrepareDial();
		break;
	case ESPFunc.SPFunc_CancelDialout:
		_wssp.cancelDial();
		break;
	case ESPFunc.SPFunc_DropCall:
		_wssp.dropCall();
		break;
	case ESPFunc.SPFunc_FinishWrapup:
		_wssp.finishWrapup();
		break;
	case ESPFunc.SPFunc_Leave:
		_wssp.leave();
		break;
	case ESPFunc.SPFunc_Resume:
		_wssp.resumeWork();
		break;
	case ESPFunc.SPFunc_Hold:
		_wssp.hold();
		break;
	case ESPFunc.SPFunc_Unhold:
		_wssp.fetchHold();
		break;
	case ESPFunc.SPFunc_Consult:
		_wssp.prepareConsult();
		break;
	case ESPFunc.SPFunc_CancelConsult:
		_wssp.cancelConsult();
		break;
	case ESPFunc.SPFunc_FinishConsult:
	case ESPFunc.SPFunc_FinishCallout:
		_wssp.finishConsult();
		break;
	case ESPFunc.SPFunc_ConsultTransfer:
	case ESPFunc.SPFunc_CalloutTransfer:
		_wssp.consultTransfer();
		break;
	case ESPFunc.SPFunc_CallOut:
		_wssp.prepareCallout();
	case ESPFunc.SPFunc_CallInner:
		_wssp.prepareCallInner();
		break;
	case ESPFunc.SPFunc_CancelPrepareCallInner:
		_wssp.cancelPrepareCallInner();
		break;
	case ESPFunc.SPFunc_CancelCallInner:
		_wssp.cancelCallInner();
		break;
	case ESPFunc.SPFunc_Monitor:
		_wssp.prepareMonitor();
		break;
	case ESPFunc.SPFunc_CancelPrepareMonitor:
		_wssp.cancelPrepareMonitor();
		break;
	case ESPFunc.SPFunc_FinishMonitor:
		_wssp.finishMonitor();
		break;
	case ESPFunc.SPFunc_ConsultConf:
	case ESPFunc.SPFunc_CalloutConf:
		_wssp.consultConf();
		break;
	case ESPFunc.SPFunc_HoldConsult:
	case ESPFunc.SPFunc_HoldOutLine:
		_wssp.consultSwap();
		break;
	case ESPFunc.SPFunc_FetchConsult:
	case ESPFunc.SPFunc_FetchOutline:
		_wssp.consultSwapBack();
		break;
	case ESPFunc.SPFunc_FinishConf:
		_wssp.dropConf();
		break;
	case ESPFunc.SPFunc_CancelWait:
		_wssp.cancelWait();
		break;
	case ESPFunc.SPFunc_SoftHookOff:
		_wssp.answerCall();
		break;
	case ESPFunc.SPFunc_AgentMsg:
	case ESPFunc.SPFunc_AgentMsgOn:
		// _wssp.prepareMonitorContorl();
		_wssp.agentMsg();
		break;
	case ESPFunc.SPFunc_MonitorControl:
		_wssp.prepareMonitorContorl();
		break;
	case ESPFunc.SPFunc_Intercept:
		_wssp.intercept();
		break;
	case ESPFunc.SPFunc_Intervene:
		_wssp.intervene();
		break;
	case ESPFunc.SPFunc_ForceDrop:
		_wssp.forceDrop();
		break;
	}
};

/**
 * 离席
 */
WSSoftPhone.prototype.leave = function(reason) {
	if (!reason) {
		reason = "0";
	}
	this.leaveReason = reason;
	this.trace(this.agentId + " leave:" + reason);
	var cmd = new SPCommand(this, ESPCommand.Leave);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams("leaveReason", reason);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 复席
 */
WSSoftPhone.prototype.resumeWork = function() {
	this.trace(this.agentId + " resumeWork");
	var cmd = new SPCommand(this, ESPCommand.ResumeWork);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 保持
 */
WSSoftPhone.prototype.hold = function() {
	this.trace(this.agentId + " hold");
	var cmd = new SPCommand(this, ESPCommand.Hold);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 取保持
 */
WSSoftPhone.prototype.fetchHold = function() {
	this.trace(this.agentId + " hold");
	var cmd = new SPCommand(this, ESPCommand.FetchHold);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 外拨准备
 */
WSSoftPhone.prototype.prepareDial = function() {
	this.trace(this.agentId + " prepareDial");
	var cmd = new SPCommand(this, ESPCommand.PrepareDial);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};
/**
 * 取消外拨准备
 */
WSSoftPhone.prototype.cancelPrepareDial = function() {
	this.trace(this.agentId + " cancelPrepareDial");
	var cmd = new SPCommand(this, ESPCommand.CancelPrepareDial);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 外拨
 * 
 * @param phoneNum
 *            用户号码，需要带呼叫中心的出局码
 * @param ani
 *            动态主叫号码，仅系统支持动态主叫时可用，而且必须在系统的主叫号码范围内，否则会导致外拨失败
 */
WSSoftPhone.prototype.dial = function(phoneNum,ani) {
	this.trace(this.agentId + " dial");
	var cmd = new SPCommand(this, ESPCommand.Dial);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.phoneNum, phoneNum);
	//仅系统支持动态主叫时可用，而且必须在系统的主叫号码范围内，否则会导致外拨失败
	if(ani){
		cmd.pushParams("ani", ani);
	}
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};


/**
 * 加密外拨
 * @param prefix 外拨前缀，由于业务系统加密的号码一般不带出局码，可以添加明文的prefix协助外拨
 * @param phoneNum 加密的电话号码
 * @param encryptMode 加密模式，与EEncryptMode对应
 * @param ani 主叫号码，系统可指定动态主叫时使用
 */
WSSoftPhone.prototype.encryptDial = function(prefix,phoneNum,encryptMode, ani) {
	this.trace(this.agentId + " encryptDial");
	var cmd = new SPCommand(this, ESPCommand.EncryptDial);
	cmd.ins = this.ins;
	if(prefix){
		cmd.pushParams(ESPAttr.prefix,prefix);
	}
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.phoneNum, phoneNum);
	cmd.pushParams(ESPAttr.encryptMode, encryptMode);
	
	this.trace("ESPAttr.phoneNum:"+ ESPAttr.phoneNum);
	this.trace("phoneNum:"+ phoneNum);
	this.trace("ESPAttr.encryptMode:"+ ESPAttr.encryptMode);
	this.trace("encryptMode:"+ encryptMode);
	//仅系统支持动态主叫时可用，而且必须在系统的主叫号码范围内，否则会导致外拨失败
	if(ani){
		cmd.pushParams(ESPAttr.ani, ani);
	}
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
	
	
	

};




/**
 * 取消外拨
 */
WSSoftPhone.prototype.cancelDial = function() {
	this.trace(this.agentId + " cancelDial");
	var cmd = new SPCommand(this, ESPCommand.CancelDial);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};
/**
 * 挂机
 */
WSSoftPhone.prototype.dropCall = function() {
	this.trace(this.agentId + " dropCall");
	var cmd = new SPCommand(this, ESPCommand.DropCall);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 完成话后处理
 */
WSSoftPhone.prototype.finishWrapup = function() {
	this.trace(this.agentId + " finishWrapup");
	var cmd = new SPCommand(this, ESPCommand.FinishWrapup);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 内部咨询准备，刷新列表
 */
WSSoftPhone.prototype.prepareConsult = function() {
	this.trace(this.agentId + " prepareConsult");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams(ESPAttr.agentListType, EAgentListType.AGENTLISTTYPE_CONSULT);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 内部咨询
 */
WSSoftPhone.prototype.consult = function(destSPType, destSPIns) {
	this.trace(this.agentId + " consult(" + destSPType + ":" + destSPIns + ")");
	var cmd = new SPCommand(this, ESPCommand.Consult);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.destSPType, destSPType);
	cmd.pushParams(ESPAttr.destSPIns, destSPIns);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 取消咨询
 */
WSSoftPhone.prototype.cancelConsult = function() {
	this.trace(this.agentId + " cancelConsult()");
	var cmd = new SPCommand(this, ESPCommand.CancelConsult);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 结束咨询
 */
WSSoftPhone.prototype.finishConsult = function() {
	this.trace(this.agentId + " finishConsult()");
	var cmd = new SPCommand(this, ESPCommand.FinishConsult);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 咨询转接
 */
WSSoftPhone.prototype.consultTransfer = function() {
	this.trace(this.agentId + " consultTransfer()");
	var cmd = new SPCommand(this, ESPCommand.ConsultTransfer);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.prepareCallout = function() {
	var _wssp = this;
	_wssp.showTip("请输入外部咨询号码");
	if (_wssp.eventHandler.onPrepareCallOutSucc) {
		_wssp.eventHandler.onPrepareCallOutSucc();
	} else {
		var phoneNum = prompt("请输入外部咨询号码", "");
		if (phoneNum != null && phoneNum != "") {
			_wssp.callout(phoneNum);
		} else {
			_wssp.showTip("外部咨询取消");
		}
	}
};

WSSoftPhone.prototype.callout = function(phoneNum) {
	var _wssp = this;
	_wssp.showTip("外部咨询" + phoneNum + "...");
	// 统一调用Consult接口
	_wssp.consult("OUT", phoneNum);
};

WSSoftPhone.prototype.prepareCallInner = function() {
	this.trace(this.agentId + " prepareCallInner()");
	var cmd = new SPCommand(this, ESPCommand.PrepareCallInner);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.cancelPrepareCallInner = function() {
	this.trace(this.agentId + " cancelPrepareCallInner()");
	var cmd = new SPCommand(this, ESPCommand.CancelPrepareCallInner);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.refreshCallInnerAgentList = function() {
	this.trace(this.agentId + " refreshCallInnerAgentList");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams(ESPAttr.agentListType,
			EAgentListType.AGENTLISTTYPE_CALLINNER);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.refreshTransferAgentList = function() {
	this.trace(this.agentId + " refreshOneSteptransferAgentList");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd
			.pushParams(ESPAttr.agentListType,
					EAgentListType.AGENTLISTTYPE_TRANSFER);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.callInner = function(destSPType, destSPIns) {
	this.trace(this.agentId + " callInner(" + destSPType + ":" + destSPIns
			+ ")");
	var cmd = new SPCommand(this, ESPCommand.CallInner);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.destSPType, destSPType);
	cmd.pushParams(ESPAttr.destSPIns, destSPIns);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.cancelCallInner = function() {
	this.trace(this.agentId + " cancelCallInner()");
	var cmd = new SPCommand(this, ESPCommand.CancelCallInner);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.prepareMonitor = function() {
	this.trace(this.agentId + " prepareMonitor");
	var cmd = new SPCommand(this, ESPCommand.PrepareMonitor);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.cancelPrepareMonitor = function() {
	this.trace(this.agentId + " cancelPrepareMonitor");
	var cmd = new SPCommand(this, ESPCommand.CancelPrepareMonitor);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.refreshMonitorAgentList = function() {
	this.trace(this.agentId + " refreshMonitorAgentList");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.agentListType, EAgentListType.AGENTLISTTYPE_MONITOR);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.monitorAgent = function(destSPType, destSPIns) {
	this.trace(this.agentId + " monitorAgent(" + destSPType + ":" + destSPIns
			+ ")");
	var cmd = new SPCommand(this, ESPCommand.MonitorAgent);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams(ESPAttr.destSPType, destSPType);
	cmd.pushParams(ESPAttr.destSPIns, destSPIns);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.finishMonitor = function() {
	this.trace(this.agentId + " finishMonitor()");
	var cmd = new SPCommand(this, ESPCommand.FinishMonitor);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.consultConf = function() {
	this.trace(this.agentId + " consultConf()");
	var cmd = new SPCommand(this, ESPCommand.ConsultConf);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};
WSSoftPhone.prototype.consultSwap = function() {
	this.trace(this.agentId + " consultSwap()");
	var cmd = new SPCommand(this, ESPCommand.ConsultSwap);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.consultSwapBack = function() {
	this.trace(this.agentId + " consultSwapBack()");
	var cmd = new SPCommand(this, ESPCommand.ConsultSwapBack);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.dropConf = function() {
	this.trace(this.agentId + " dropConf()");
	var cmd = new SPCommand(this, ESPCommand.DropConf);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.cancelWait = function() {
	this.trace(this.agentId + " cancelWait()");
	var cmd = new SPCommand(this, ESPCommand.CancelWait);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.transferToIVR = function(ivrinfo) {

	// SPTransferIVRInfo
	this.trace(this.agentId + " transferToIVR()");
	var cmd = new SPCommand(this, ESPCommand.TransferToIVR);
	cmd.ins = this.ins;
	// cmd.pushParams(ESPAttr.agentId, this.agentId);
	cmd.pushParams("SVN", ivrinfo.svn);
	cmd.pushParams("TRANSFERPREPARE_CHECKPASSWORD", ivrinfo.checkPassword);
	if (ivrinfo.params) {
		for ( var key in ivrinfo.params) {
			if (typeof (ivrinfo.params[key]) != " function ") {
				cmd.pushParams(key, ivrinfo.params[key]);
			}
		}
	}

	// 追加通过setCOInfo设置的信息
	if (this.tempCOInfos) {
		for ( var key in this.tempCOInfos) {
			if (typeof (this.tempCOInfos[key]) != " function ") {
				cmd.pushParams(key, this.tempCOInfos[key]);
			}
		}
	}

	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.answerCall = function() {
	this.trace(this.agentId + " answerCall()");
	var cmd = new SPCommand(this, ESPCommand.AnswerCall);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};
WSSoftPhone.prototype.agentMsg = function() {
	this.trace(this.agentId + " agentMsg()");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd
			.pushParams(ESPAttr.agentListType,
					EAgentListType.AGENTLISTTYPE_AGENTMSG);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.prepareMonitorContorl = function() {
	this.trace(this.agentId + " prepareMonitorContorl()");
	var cmd = new SPCommand(this, ESPCommand.RefreshAgentList);
	cmd.ins = this.ins;
	cmd.pushParams("agentId", this.agentId);
	cmd.pushParams(ESPAttr.agentListType,
			EAgentListType.AGENTLISTTYPE_MONITORCONTROL);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.monitorControl = function(controlType, destIns,
		extraParam) {
	// 'controlType 0-监听 1、强制签出；2、强制离席；3:强制复席;4：强制话后完成 5:强制设置工作模式
	this.trace(this.agentId + " monitorControl(" + controlType + "," + destIns
			+ "," + extraParam + ")");
	if (controlType == "0") {
		this.monitorAgent("AGT", destIns);
	} else {
		var cmd = new SPCommand(this, ESPCommand.MonitorControl);
		cmd.ins = this.ins;
		cmd.pushParams(ESPAttr.agentId, this.agentId);
		cmd.pushParams(ESPAttr.destSPType, "AGT");
		cmd.pushParams(ESPAttr.destSPIns, destIns);
		cmd.pushParams(ESPAttr.controlType, controlType);
		cmd.pushParams(ESPAttr.extraControlParam, extraParam);
		if (this.isReady()) {
			this.ws.send(cmd.toString());
		}
	}
};

WSSoftPhone.prototype.intercept = function() {
	this.trace(this.agentId + " intercept()");
	var cmd = new SPCommand(this, ESPCommand.Intercept);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.intervene = function() {
	this.trace(this.agentId + " intervene()");
	var cmd = new SPCommand(this, ESPCommand.Intervence);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.forceDrop = function() {
	this.trace(this.agentId + " forceDrop()");
	var cmd = new SPCommand(this, ESPCommand.ForceDrop);
	cmd.ins = this.ins;
	cmd.pushParams(ESPAttr.agentId, this.agentId);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.oneStepTransfer = function(transferInfo) {
	// SPTransferIVRInfo
	this.trace(this.agentId + " oneStepTransfer()");
	var cmd = new SPCommand(this, ESPCommand.OneStepTransfer);
	cmd.ins = this.ins;
	cmd.pushParams("destType", transferInfo.destType);
	cmd.pushParams("destIns", transferInfo.destIns);
	if (transferInfo.params) {
		for ( var key in transferInfo.params) {
			if (typeof (transferInfo.params[key]) != " function ") {
				cmd.pushParams(key, transferInfo.params[key]);
			}
		}
	}

	// 追加通过setCOInfo设置的信息
	if (this.tempCOInfos) {
		for ( var key in this.tempCOInfos) {
			if (typeof (this.tempCOInfos[key]) != " function ") {
				cmd.pushParams(key, this.tempCOInfos[key]);
			}
		}
	}

	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.wsHello = function(helloInfo) {
	// SPTransferIVRInfo
	var myDate = new Date();// 获取系统当前时间
	// this.trace(this.agentId + " wsHello()");
	var cmd = new SPCommand(this, ESPCommand.WSHello);
	cmd.ins = this.ins;
	cmd.pushParams("helloInfo", helloInfo);
	cmd.pushParams("time", myDate.toLocaleString());
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

/**
 * 向创建者提交跟踪日志
 * 
 * @param info
 *            日志信息
 */
WSSoftPhone.prototype.trace = function(info) {
	var _wssp = this;
	if (this.eventHandler && this.eventHandler.onTrace) {
		this.eventHandler.onTrace.call(_wssp, info);
	}
};

/**
 * 向创建者显示提示
 * 
 * @param info
 *            提示信息
 */
WSSoftPhone.prototype.showTip = function(info) {
	var _wssp = this;
	if (this.eventHandler && this.eventHandler.onShowTip) {
		this.eventHandler.onShowTip.call(_wssp, info);
	}
};

/**
 * 向创建者通知事件
 * 
 * @param evt
 *            事件
 */
WSSoftPhone.prototype.onEvent = function(evt) {
	var _wssp = this;
	if (this.eventHandler && this.eventHandler.onEvent) {
		this.eventHandler.onEvent.call(_wssp, evt);
	}
};

WSSoftPhone.prototype.notifyStateChange = function(agentState) {
	var _wssp = this;
	_wssp.writeLog("onStateChange(" + agentState + ")");
	if (this.eventHandler && this.eventHandler.onStateChange) {
		this.eventHandler.onStateChange.call(_wssp, agentState);
	}
};

WSSoftPhone.prototype.notifySettings = function(agentState) {
	var _wssp = this;
	_wssp.writeLog("onNotifySettings(" + agentState + ")");
	if (this.eventHandler && this.eventHandler.onNotifySettings) {
		this.eventHandler.onNotifySettings.call(_wssp);
	}
};

WSSoftPhone.prototype.getCurStateName = function() {
	return this.getAgentStateName();
	//return getWSSoftPhoneText("AgentState_" + this.agentState);
};

WSSoftPhone.prototype.getCurWorkModeName = function() {
	for (var i = 0; i < this.workModeSettings.length; i++) {
		var wkmd = this.workModeSettings[i];
		if (wkmd.serviceWorkMode == this.agentWorkMode) {
			return wkmd.serviceWorkModeName;
		}
	}
	return "未知模式";
};

WSSoftPhone.prototype.getCoInfos = function() {
	return this.coInfos;
};

WSSoftPhone.prototype.getQueueList = function() {
	return this.queueList;
};

WSSoftPhone.prototype.setCOInfo = function(key, value) {
	this.tempCOInfos[key] = value;
};

WSSoftPhone.prototype.checkKeepLogon = function(agentInfos) {
	if (agentInfos.canKeepLogon && agentInfos.canKeepLogon == "true") {
		this.canKeepLogon = true;
		if (agentInfos.isKeepLogon) {
			this.isKeepLogon = (agentInfos.isKeepLogon == "true");
		}
	} else {
		this.canKeepLogon = false;
		this.isKeepLogon = false;
	}
	this.notifyFunctionSwitch("KeepLogon", this.canKeepLogon, this.isKeepLogon);
};

WSSoftPhone.prototype.checkMonitor = function(agentInfos) {
	this.isMonitor = false;
	this.monitorDepts = "";
	if (agentInfos) {
		this.isMonitor = ("true" == agentInfos.isMonitor);
		if (agentInfos.monitorDepts) {
			this.monitorDepts = agentInfos.monitorDepts;
		}
	}
};

WSSoftPhone.prototype.checkAutoAnswer = function(agentInfos) {
	this.isMonitor = false;
	this.monitorDepts = "";
	if (agentInfos) {
		this.canAutoAnswer = ("true" == agentInfos.isDigitalDevice);
	}
};

WSSoftPhone.prototype.notifyFunctionSwitch = function(functionCode, isSupport,
		isOn) {
	var _wssp = this;
	if (functionCode != "KeepLogon") {
		return;
	}
	if (this.eventHandler && this.eventHandler.onFunctionSwitch) {
		this.eventHandler.onFunctionSwitch.call(_wssp, functionCode, isSupport,
				isOn);
	}
};

WSSoftPhone.prototype.setFunctionSwitch = function(functionCode, isOn) {
	//var _wssp = this;
	if (functionCode != "KeepLogon") {
		return;
	}

	this.writeLog(this.agentId + " setFunctionSwitch(" + functionCode + ","
			+ isOn + ")");
	var cmd = new SPCommand(this, ESPCommand.SetFunctionSwitch);
	cmd.ins = this.ins;
	cmd.pushParams("functionCode", functionCode);
	cmd.pushParams("isOn", isOn);
	if (this.isReady()) {
		this.ws.send(cmd.toString());
	}
};

WSSoftPhone.prototype.onWSHello = function(resp) {
	var _wssp = this;
	if (_wssp.eventHandler.onWSHello) {
		_wssp.eventHandler.onWSHello();
	}
};

WSSoftPhone.prototype.writeLog = function(info) {
	this.trace(info);
	if (this.Logger) {
		this.Logger.writeLog(info);
	}
};

WSSoftPhone.prototype.getAgentStateName = function(st, lvrs) {
	if (!st) {
		st = this.agentState;
	}
	
	var stateName = getStateName(st) ;
	
	if (st == 23) {
		// 判断离席原因
		if( !lvrs){
			lvrs = this.leaveReason ;
		}
		stateName = stateName + "(" + this.getLeaveReasonName(lvrs)
		+ ")";
	}

	return stateName;

};

WSSoftPhone.prototype.getLeaveReasonName = function(lvrs) {
	for (var i = 0; i < this.leaveReasonSettings.length; i++) {
		var leavereason = this.leaveReasonSettings[i];
		if (leavereason.reasonId == lvrs) {
			return leavereason.reasonName;
		}
	}
	// 没有匹配，返回未知
	return "未知" + lvrs;
};

WSSoftPhone.prototype.getAgentWorkModeName = function(varwkmd) {
	if (!varwkmd) {
		varwkmd = this.agentWorkMode;
	}

	for (var i = 0; i < this.workModeSettings.length; i++) {
		var wkmd = this.workModeSettings[i];
		if (wkmd.serviceWorkMode == varwkmd) {
			return wkmd.serviceWorkModeName;
		}
	}
	// 没有匹配，返回缺省值
	return getWorkModeName(varwkmd);
};
export default WSSoftPhone
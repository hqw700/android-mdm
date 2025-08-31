package com.example.mdmclient.jpush;

import android.app.Notification;
import android.app.admin.DevicePolicyManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.example.mdmclient.MyDeviceAdminReceiver;

import org.json.JSONException;
import org.json.JSONObject;

import cn.jpush.android.api.CmdMessage;
import cn.jpush.android.api.CustomMessage;
import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.JPushMessage;
import cn.jpush.android.api.NotificationMessage;
import cn.jpush.android.service.JPushMessageReceiver;

public class PushMessageService extends JPushMessageReceiver {
    private static final String TAG = "PushMessageService";

    @Override
    public void onMessage(Context context, CustomMessage customMessage) {
        Log.i(TAG, "[onMessage] " + customMessage);
        try {
            JSONObject json = new JSONObject(customMessage.message);
            String command = json.optString("command");
            Log.i(TAG, "Received command: " + command);

            DevicePolicyManager devicePolicyManager = (DevicePolicyManager) context.getSystemService(Context.DEVICE_POLICY_SERVICE);
            ComponentName componentName = new ComponentName(context, MyDeviceAdminReceiver.class);

            if (!devicePolicyManager.isAdminActive(componentName)) {
                Log.e(TAG, "Device admin is not active, cannot execute command.");
                return;
            }

            switch (command) {
                case "lock":
                    Log.i(TAG, "Executing lock command");
                    devicePolicyManager.lockNow();
                    break;
                case "disable_camera":
                    Log.i(TAG, "Executing disable_camera command");
                    devicePolicyManager.setCameraDisabled(componentName, true);
                    break;
                case "enable_camera":
                    Log.i(TAG, "Executing enable_camera command");
                    devicePolicyManager.setCameraDisabled(componentName, false);
                    break;
                default:
                    Log.w(TAG, "Unknown command: " + command);
                    break;
            }
        } catch (JSONException e) {
            Log.e(TAG, "Failed to parse custom message", e);
        }
    }

    @Override
    public void onNotifyMessageOpened(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageOpened] " + message);
    }

    @Override
    public void onMultiActionClicked(Context context, Intent intent) {
        Log.e(TAG, "[onMultiActionClicked] 用户点击了通知栏按钮");
        String nActionExtra = intent.getExtras().getString(JPushInterface.EXTRA_NOTIFICATION_ACTION_EXTRA);

        //开发者根据不同 Action 携带的 extra 字段来分配不同的动作。
        if (nActionExtra == null) {
            Log.d(TAG, "ACTION_NOTIFICATION_CLICK_ACTION nActionExtra is null");
            return;
        }
        if (nActionExtra.equals("my_extra1")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮一");
        } else if (nActionExtra.equals("my_extra2")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮二");
        } else if (nActionExtra.equals("my_extra3")) {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮三");
        } else {
            Log.e(TAG, "[onMultiActionClicked] 用户点击通知栏按钮未定义");
        }
    }

    @Override
    public void onNotifyMessageArrived(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageArrived] " + message);
    }

    @Override
    public void onNotifyMessageDismiss(Context context, NotificationMessage message) {
        Log.e(TAG, "[onNotifyMessageDismiss] " + message);
    }

    @Override
    public void onRegister(Context context, String registrationId) {
        Log.e(TAG, "[onRegister] " + registrationId);
        Intent intent = new Intent("com.jiguang.demo.register");
        context.sendBroadcast(intent);
    }

    @Override
    public void onConnected(Context context, boolean isConnected) {
        Log.e(TAG, "[onConnected] " + isConnected);
    }

    @Override
    public void onCommandResult(Context context, CmdMessage cmdMessage) {
        Log.e(TAG, "[onCommandResult] " + cmdMessage);
    }

    @Override
    public void onTagOperatorResult(Context context, JPushMessage jPushMessage) {
        super.onTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onCheckTagOperatorResult(Context context, JPushMessage jPushMessage) {
        super.onCheckTagOperatorResult(context, jPushMessage);
    }

    @Override
    public void onAliasOperatorResult(Context context, JPushMessage jPushMessage) {
        super.onAliasOperatorResult(context, jPushMessage);
    }

    @Override
    public void onMobileNumberOperatorResult(Context context, JPushMessage jPushMessage) {
        super.onMobileNumberOperatorResult(context, jPushMessage);
    }

    @Override
    public void onNotificationSettingsCheck(Context context, boolean isOn, int source) {
        super.onNotificationSettingsCheck(context, isOn, source);
        Log.e(TAG, "[onNotificationSettingsCheck] isOn:" + isOn + ",source:" + source);
    }

}

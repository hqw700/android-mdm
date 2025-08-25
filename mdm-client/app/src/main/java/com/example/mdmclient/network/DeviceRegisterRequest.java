package com.example.mdmclient.network;

public class DeviceRegisterRequest {
    public String device_id;
    public String name;
    public String fcm_token;

    public String model;

    public String ip_address;

    public String mac_address;
    public String os_version;
    public String software_version;

    public DeviceRegisterRequest(String device_id, String name, String fcm_token, String model, String ip_address, String mac_address, String os_version, String software_version) {
        this.device_id = device_id;
        this.name = name;
        this.fcm_token = fcm_token;
        this.model = model;
        this.ip_address = ip_address;
        this.mac_address = mac_address;
        this.os_version = os_version;
        this.software_version = software_version;
    }

}

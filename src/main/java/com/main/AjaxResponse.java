package com.main;


public class AjaxResponse {
    private String status;
    private Object result;

    public AjaxResponse(String status, Object result){
        this.status = status;
        this.result = result;
    }

    public AjaxResponse(){}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }
}

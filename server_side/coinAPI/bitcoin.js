'use strict';

const utils = require('../utils.js');
const alerts = require('../alerts');
const $ = require('jquery');

const urlAPI = "https://btc.blockr.io/api/v1/address/";
const urlAPIpush = "https://btc.blockr.io/api/v1/tx/push";

exports.netID = 0;
exports.name = "bitcoin";
exports.Shortname = "BTC";
exports.fee = 0.0001;

exports.getBalance = function(arrayAddr, callback)
{
    console.log('get balance ' + urlAPI + "balance/" + arrayAddr.toString() + "?confirmations=0");
    $.getJSON( urlAPI + "balance/" + arrayAddr.toString() + "?confirmations=0", function(data) {
        callback(data);
    })
      .fail(function() {
          callback(utils.JSONreturn(false, 'error'));
      });      
};

exports.pushTransaction = function(hexTX)
{
    console.log('pushTransaction' + hexTX);
    $.post( urlAPIpush, { "hex": hexTX })
      .done(function( data ) {
        alerts.OnTransactionSent(data);
      })
      .fail(function(e) {
        alerts.OnTransactionSent(e);
      });   
};

exports.getTransactions = function(arrayAddr, callback)
{
    $.getJSON( urlAPI  + "txs/" + arrayAddr.toString(), function(data) {
        callback(exports.netID, data.data);
        
        $.getJSON( urlAPI + "unconfirmed/" + arrayAddr.toString(), function(data2) {
            callback(exports.netID, data2.data);
        }).fail(function() {
            callback(exports.netID, utils.JSONreturn(false, 'error'));
        });      
    }).fail(function() {
        callback(exports.netID, utils.JSONreturn(false, 'error'));
    });   
    
}

exports.getUnspentTransactions = function(arrayAddr, callback)
{
    console.log('getUnspentTransactions: ' + urlAPI + "unspent/" + arrayAddr.toString());
    $.getJSON( urlAPI + "unspent/" + arrayAddr.toString(), function(data) {
        callback(exports.netID, data);
    })
      .fail(function() {
          callback(exports.netID, utils.JSONreturn(false, 'error'));
      });      
}

exports.CheckFee = function(hexTX, fee)
{
    var bRet = false;
    const fRecommended = exports.fee/(1+hexTX.length/(2*1024));
    if (parseFloat(fee) < fRecommended)
        alerts.Alert('Warning', 'Your transaction fee is too small (recommended "'+fRecommended +'")<BR>Push transaction anyway (press OK button) ?', function() {bRet = true;});

    return bRet;        
}

exports.CheckHexTransaction = function(hex) {return hex;};
exports.GetOutTxAmount = function(amount) {return parseInt(parseFloat(amount)/0.00000001);};

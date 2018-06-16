// ----------------------------------------------------------------//
//                    Utilitarios del sistema                      //
//  @ld.matamoros@gmail.com                                        //
//  Author: Luis Matamoros                                         //
//                                                                 //
// ----------------------------------------------------------------//

/* -----------------------------------------------------------------/
    Date:    08-05-2018
    Author:  Luis Matamoros
    Changes:
       First version 
/----------------------------------------------------------------- */
"use strict"

const Validator = require("jsonschema").Validator,
    intformat = require("biguint-format"),
    FlakeId = require("flake-idgen"),
    crypto = require("crypto"),
    _ = require("underscore"),
    constants = require("./resources/constants"),
    statusCodes = require("./resources/httpStatusCodes.json")

var Utilities = function () {
    this._validator = new Validator()
    this._flakeIdGen = new FlakeId()
    this.codes = statusCodes
}

Utilities.prototype.validateSchema = function (body, schema) {
    let self = this
    return self._validator.validate(body, schema).errors
}

Utilities.prototype.errorResponse = function (statusCode, error, res, baseResponse) {
    let errMsg = (_.isObject(error) && "error" in error)
        ? error.error : error.toString()
    baseResponse = baseResponse && _.isObject(baseResponse) ? baseResponse : {}
    res.status(statusCode).json(_.extend(baseResponse, {"error": errMsg}))
}

Utilities.prototype.okResponse = function (res, baseResponse) {
    baseResponse = baseResponse && _.isObject(baseResponse) ? baseResponse : {}
    res.json(baseResponse)
}

Utilities.prototype.uidGen = function () {
    let self = this
    return intformat(self._flakeIdGen.next(), "dec").toString()
}

Utilities.prototype.timeBuilder = function (time) {
    let hours = parseInt(time / 100)
    let minutes = parseInt(time % 100)
    return hours + ":" + minutes + ":00"
}

Utilities.prototype.dateBuilder = function (time) {
    return new Date(time)
}

Utilities.prototype.currentDate = function () {
    return new Date()
}

Utilities.prototype.dateTimeToDate = function (date) {
    return new Date(date).getTime()
}

Utilities.prototype.timeToNumber = function (time) {
    let arrTime = time.split(":")
    let strNumber = ""
    if (arrTime.length >= 2) {
        strNumber = arrTime[0] + arrTime[1]
    } else if (arrTime.length === 1) {
        strNumber = arrTime[0]
    } else {
        strNumber = 0
    }
    return parseInt(strNumber)
}

Utilities.prototype.numberToBinary = function (value) {
    return (value >>> 0).toString(2)
}

Utilities.prototype.binaryToNumber = function (value) {
    return parseInt(value, 2)
}

Utilities.prototype.dateISOBuilder = function (time) {
    return new Date(time).toISOString().substring(0, 19).replace("T", " ")
}

Utilities.prototype.dateLocalBuilder = function (time) {
    return new Date(time).toLocaleString()
}

Utilities.prototype.isBase64 = function (text) {
    let regExp = new RegExp(constants.REGEX_BASE64)
    return regExp.test(text)
}

Utilities.prototype.encodeBase64 = function (text) {
    let buff = Buffer.from(text)
    return buff.toString("base64")
}

Utilities.prototype.decodeBase64 = function (text) {
    let buff = Buffer.from(text, "base64")
    return buff.toString("ascii")
}

Utilities.prototype.md5 = function (text) {
    return crypto.createHash("md5").update(text).digest("hex")
}

Utilities.instance = null

Utilities.getInstance = function () {
    if (this.instance === null) {
        this.instance = new Utilities()
    }
    return this.instance
}

module.exports = Utilities.getInstance()

/**
 * Created by srbo on 24-Jun-17.
 */

(function () {
    "use strict";

    var module = angular.module("app");
    module.factory("utils", function () {

        var utils = {

            object: function (o) {
                function F() {
                }

                F.prototype = o;
                return new F();
            },

            deepCopy: function (o) {
                return JSON.parse(JSON.stringify(o));
            },



            setDeepValue: function (object, path, value) {
                var obj = this.deepCopy(object);
                var copy = obj;

                path = path.split('.');
                for (var i = 0; i < path.length - 1; i++)
                    obj = obj[path[i]];

                obj[path[i]] = value;

                return copy;
            },


            getDeepValue: function (object, path) {
                var obj = this.deepCopy(object);

                path = path.split('.');
                for (var i = 0; i < path.length - 1; i++) {
                    if(obj[path[i]]) {
                        obj = obj[path[i]];
                    } else return;
                }
                return obj[path[i]];
            },

            isObjectEmpty: function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        return false;
                }

                return JSON.stringify(obj) === JSON.stringify({});
            },

            uuid: function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            },

            removeDuplicates: function (a) {
                var seen = {};
                var out = [];
                var len = a.length;
                var j = 0;
                for(var i = 0; i < len; i++) {
                    var item = a[i];
                    if(seen[item] !== 1) {
                        seen[item] = 1;
                        out[j++] = item;
                    }
                }
                return out;
            },

            getBase64FromFile: function (file, successCallback, errorCallback) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.readAsDataURL(file);
                reader.onload = function () {
                    if(successCallback) successCallback(reader.result);
                };
                reader.onerror = function (error) {
                    if(errorCallback) errorCallback(error);
                };
            },

            b64toBlob: function (b64Data, contentType, sliceSize) {
                contentType = contentType || "";
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            },

            b64EncodeUnicode: function (str) {
                // first we use encodeURIComponent to get percent-encoded UTF-8,
                // then we convert the percent encodings into raw bytes which
                // can be fed into btoa.
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                    function toSolidBytes(match, p1) {
                        return String.fromCharCode('0x' + p1);
                    }));
            },

            b64DecodeUnicode: function (str) {
                // Going backwards: from bytestream, to percent-encoding, to original string.
                return decodeURIComponent(atob(str).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            },

            isMobile: isMobile,

            linq: {

                select: function (array, func) {

                    var resultArray = [];

                    for (var i = 0; i < array.length; i++) {
                        resultArray.push(func(array[i]));
                    }

                    return resultArray;
                },

                first: function (array, func) {
                    for (var i = 0; i < array.length; i++) {
                        if (func(array[i])) return array[i];
                    }
                },

                last: function (array, func) {
                    for (var i = array.length; i > 0; i--) {
                        if (func(array[i])) return array[i];
                    }
                },

                where: function (array, func) {
                    var resultArray = [];

                    for (var i = 0; i < array.length; i++) {
                        if (func(array[i])) resultArray.push(array[i]);
                    }

                    return resultArray;
                },

                removeFirst: function (array, func) {
                    for (var i = 0; i < array.length; i++) {
                        if (func(array[i])) {
                            array.splice(i, 1);
                            return true;
                        }
                    }
                },

                removeFirstFromBehind: removeFirstFromBehind,

                removeLast: removeFirstFromBehind,



                removeAll: function (array, func) {
                    for (var i = array.length - 1; i >= 0; i--) {
                        if (func(array[i])) {
                            array.splice(i, 1);
                        }
                    }
                },

                indexOf: function (array, func) {
                    for (var i = 0; i < array.length; i++) {
                        if (func(array[i])) return i;
                    }
                    return -1;
                },

                any: function (array, func){
                    return this.where(array, func).length > 0;
                },

                all: function (array, func){
                    return this.where(array, func).length === array.length;
                },

                count: function (array, func){
                    return this.where(array, func).length;
                },

                max: function(array, func) {
                    if(!array || array.length === 0) throw "utils::linq::max:: array undefined or empty";
                    if(array.length === 1) return func(array[0]);
                    var max = func(array[0]);
                    for(var i=1; i<array.length; i++) {
                        if(func(array[i]) > max) max = func(array[i]);
                    }
                    return max;
                },

                min: function(array, func) {
                    if(!array || array.length === 0) return -1;
                    if(array.length === 1) return func(array[0]);
                    var min = func(array[0]);
                    for(var i=1; i<array.length; i++) {
                        if(func(array[i]) < min) min = func(array[i]);
                    }
                    return min;
                },

                sum: function(array, func) {
                    if(!array || array.length === 0) throw "utils::linq::sum:: array undefined or empty";
                    if(array.length === 1) return func(array[0]);
                    var sum = func(array[0]);
                    for(var i=1; i<array.length; i++) {
                        sum = sum + func(array[i]);
                    }
                    return sum;
                },

                difference: function (array1, array2, funcAr1, funcAr2) {
                    var result = [];

                    if(array1.length === 0) return [];
                    if(array2.length === 0) return utils.deepCopy(array1);

                    var found = false;

                    for(var i = 0; i < array1.length; i++) {
                        found = false;
                        for(var j = 0; j < array2.length; j++) {
                            if( funcAr1(array1[i]) === funcAr2(array2[j]) ) {
                                found = true;
                                break;
                            }
                        }
                        if(!found) result.push(array1[i]);
                    }

                    return result;
                },

                intersect: function (array1, array2, funcAr1, funcAr2) {
                    var result = [];

                    if(array1.length === 0 || array2.length === 0) return [];

                    for(var i = 0; i < array1.length; i++) {
                        for(var j = 0; j < array2.length; j++) {
                            if( funcAr1(array1[i]) === funcAr2(array2[j]) ) {
                                result.push(array1[i]);
                            }
                        }
                    }

                    return result;
                },

                groupByMultipleFlatten: function (array, arrayOfKeys) {
                    var group = this.groupByMultiple(array, arrayOfKeys);
                    return flattenGroupByObject(group);
                },

                groupByMultiple: function (array, arrayOfKeys) {
                    // check if all objects from array have all of the keys from arrayOfKeys
                    if(arrayOfKeys.length === 0) return array;
                    if(arrayOfKeys.length === 1) return this.groupBySingle(array, arrayOfKeys[0]);

                    var group = this.groupBySingle(array, arrayOfKeys[0]);
                    var newList = arrayOfKeys.slice(1, arrayOfKeys.length);
                    for (var prop in group) {
                        if (group.hasOwnProperty(prop)) {
                            group[prop] = this.groupByMultiple(group[prop], newList);
                        }
                    }

                    return group;

                },

                groupBySingle: function (array, key) {
                    var group = {};
                    array.forEach(function (element) {
                        if(element.hasOwnProperty(key)) {
                            if(group.hasOwnProperty(element[key])) group[element[key]].push(element);
                            else {
                                group[element[key]] = [];
                                group[element[key]].push(element);
                            }
                        }
                    });
                    return group;
                },

                mergeSort: function (array, func) {
                    if (array.length < 2)
                        return array;

                    var middle = parseInt(array.length / 2);
                    var left   = array.slice(0, middle);
                    var right  = array.slice(middle, array.length);

                    return merge(this.mergeSort(left, func), this.mergeSort(right, func), func);
                },

                binarySearch: function (array, searchedValue, func) {
                    var startIndex = 0;
                    var stopIndex = array.length - 1;
                    var index = (startIndex + stopIndex) >> 1;

                    while(func(array[index]) !== searchedValue && startIndex < stopIndex){
                        if (searchedValue < func(array[index])) {
                            stopIndex = index - 1;
                        } else if (searchedValue > func(array[index])) {
                            startIndex = index + 1;
                        }

                        index = (startIndex + stopIndex) >> 1;
                    }

                    if (func(array[index]) === searchedValue) return array[index];
                },

                binarySearchIndexOf: function (array, searchedValue, func) {
                    var startIndex = 0;
                    var stopIndex = array.length - 1;
                    var index = (startIndex + stopIndex) >> 1;

                    while(func(array[index]) !== searchedValue && startIndex < stopIndex){
                        if (searchedValue < func(array[index])) {
                            stopIndex = index - 1;
                        } else if (searchedValue > func(array[index])) {
                            startIndex = index + 1;
                        }

                        index = (startIndex + stopIndex) >> 1;
                    }

                    if (func(array[index]) === searchedValue) return index;
                    else return -1;
                },

                buildHash: function (array, func) {
                    var hash = {};

                    array.forEach(function (element) {
                        hash[func(element)] = element;
                    });

                    return hash;
                }
            },


            strings: {
                replaceAll: function (target, search, replacement) {
                    return target.split(search).join(replacement);
                }
            }


        };

        return utils;



        /// helper functions /////////

        function removeFirstFromBehind(array, func) {
            for (var i = array.length - 1; i >= 0; i--) {
                if (func(array[i])) {
                    array.splice(i, 1);
                    return true;
                }
            }
        }

        function merge(left, right, func) {
            var result = [];

            while (left.length && right.length) {
                if (func(left[0]) <= func(right[0])) {
                    result.push(left.shift());
                } else {
                    result.push(right.shift());
                }
            }

            while (left.length)
                result.push(left.shift());

            while (right.length)
                result.push(right.shift());

            return result;
        }

        function flattenGroupByObject(element) {
            var resultArray = [];

            function recurse(el) {
                for (var prop in el) {
                    if (el.hasOwnProperty(prop)) {
                        if(el[prop].constructor === Array) resultArray.push(el[prop]);
                        else recurse(el[prop]);
                    }
                }
            }

            recurse(element);
            return resultArray;
        }

        function flattenGroupByObjectV1(element) {
            if(element.constructor === Array) return element;

            var resultArray = [];

            if(typeof element === "object") {
                for (var prop in element) {
                    if (element.hasOwnProperty(prop)) {
                        var temp = flattenGroupByObject(element[prop]);
                        if(temp.constructor === Array) {
                            resultArray.push(temp);
                        }
                    }
                }
            }

            return resultArray;
        }

        function flattenGroupByObjectV2(element) {
            if(element.constructor === Array) return element;

            var resultArray = [];

            if(typeof element === "object") {
                for (var prop in element) {
                    if (element.hasOwnProperty(prop)) {
                        var temp = flattenGroupByObject(element[prop]);
                        if(temp.constructor === Array) {
                            temp.forEach(function (el) {
                                resultArray.push(el);
                            });
                        }
                    }
                }
            }

            return resultArray;
        }

        function convertGroupToArray(obj) {
            var array = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    array.push(obj[prop]);
                }
            }

            return array;
        }




        function isMobile() {
            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) return true;

            return false;
        }





    });


})();

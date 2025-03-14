/**
 * Tagify (v 2.9.9)- tags input component
 * By Yair Even-Or (2016)
 * Don't sell this code. (c)
 * https://github.com/yairEO/tagify
 */
"use strict";
! function(a) {
    function s(t, e) {
        if (!t) return console.warn("Tagify: ", "invalid input element ", t), this;
        this.applySettings(t, e), this.state = {}, this.value = [], this.listeners = {}, this.DOM = {}, this.extend(this, new this.EventDispatcher(this)), this.build(t), this.loadOriginalValues(), this.events.customBinding.call(this), this.events.binding.call(this), t.autofocus && this.DOM.input.focus()
    }
    a.fn.tagify = function() {
        var i = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
        return this.each(function() {
            var t, e = a(this);
            if (e.data("tagify")) return this;
            i.isJQueryPlugin = !0, t = new s(e[0], i), e.data("tagify", t)
        })
    }, s.prototype = {
        isIE: window.document.documentMode,
        TEXTS: {
            empty: "empty",
            exceed: "number of tags exceeded",
            pattern: "pattern mismatch",
            duplicate: "already exists",
            notAllowed: "not allowed"
        },
        DEFAULTS: {
            delimiters: ",",
            pattern: null,
            maxTags: 1 / 0,
            callbacks: {},
            addTagOnBlur: !0,
            duplicates: !1,
            whitelist: [],
            blacklist: [],
            enforceWhitelist: !1,
            keepInvalidTags: !1,
            autoComplete: !0,
            mixTagsAllowedAfter: /,|\.|\:|\s/,
            dropdown: {
                classname: "",
                enabled: 2,
                maxItems: 10,
                itemTemplate: ""
            }
        },
        customEventsList: ["click", "add", "remove", "invalid", "input"],
        applySettings: function(t, e) {
            var i = t.getAttribute("data-whitelist"),
                s = t.getAttribute("data-blacklist");
            if (this.settings = this.extend({}, this.DEFAULTS, e), this.settings.readonly = t.hasAttribute("readonly"), this.isIE && (this.settings.autoComplete = !1), s && (s = s.split(this.settings.delimiters)) instanceof Array && (this.settings.blacklist = s), i && (i = i.split(this.settings.delimiters)) instanceof Array && (this.settings.whitelist = i), t.pattern) try {
                this.settings.pattern = new RegExp(t.pattern)
            } catch (t) {}
            if (this.settings && this.settings.delimiters) try {
                this.settings.delimiters = new RegExp("[" + this.settings.delimiters + "]", "g")
            } catch (t) {}
        },
        parseHTML: function(t) {
            return (new DOMParser).parseFromString(t.trim(), "text/html").body.firstElementChild
        },
        escapeHtml: function(t) {
            var e = document.createTextNode(t),
                i = document.createElement("p");
            return i.appendChild(e), i.innerHTML
        },
        build: function(t) {
            var e = this.DOM,
                i = '<tags class="tagify ' + (this.settings.mode ? "tagify--mix" : "") + " " + t.className + '" ' + (this.settings.readonly ? "readonly" : "") + '>\n                            <div contenteditable data-placeholder="' + (t.placeholder || "&#8203;") + '" class="tagify__input"></div>\n                        </tags>';
            e.originalInput = t, e.scope = this.parseHTML(i), e.input = e.scope.querySelector("[contenteditable]"), t.parentNode.insertBefore(e.scope, t), 0 <= this.settings.dropdown.enabled && this.dropdown.init.call(this)
        },
        destroy: function() {
            this.DOM.scope.parentNode.removeChild(this.DOM.scope)
        },
        loadOriginalValues: function() {
            var t = this.DOM.originalInput.value;
            if (t) {
                try {
                    t = JSON.parse(t)
                } catch (t) {}
                "mix" == this.settings.mode ? this.parseMixTags(t) : this.addTags(t).forEach(function(t) {
                    t && t.classList.add("tagify--noAnim")
                })
            }
        },
        extend: function(t, e, i) {
            function s(t) {
                var e = Object.prototype.toString.call(t).split(" ")[1].slice(0, -1);
                return t === Object(t) && "Array" != e && "Function" != e && "RegExp" != e && "HTMLUnknownElement" != e
            }

            function n(t, e) {
                for (var i in e) e.hasOwnProperty(i) && (s(e[i]) ? s(t[i]) ? n(t[i], e[i]) : t[i] = Object.assign({}, e[i]) : t[i] = e[i])
            }
            return t instanceof Object || (t = {}), n(t, e), i && n(t, i), t
        },
        EventDispatcher: function(s) {
            var n = document.createTextNode("");
            this.off = function(t, e) {
                return e && n.removeEventListener.call(n, t, e), this
            }, this.on = function(t, e) {
                return e && n.addEventListener.call(n, t, e), this
            }, this.trigger = function(t, e) {
                var i;
                if (t)
                    if (s.settings.isJQueryPlugin) a(s.DOM.originalInput).triggerHandler(t, [e]);
                    else {
                        try {
                            i = new CustomEvent(t, {
                                detail: e
                            })
                        } catch (t) {
                            console.warn(t)
                        }
                        n.dispatchEvent(i)
                    }
            }
        },
        events: {
            customBinding: function() {
                var e = this;
                this.customEventsList.forEach(function(t) {
                    e.on(t, e.settings.callbacks[t])
                })
            },
            binding: function() {
                var t, e = !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0],
                    i = this.events.callbacks,
                    s = e ? "addEventListener" : "removeEventListener";
                for (var n in e && !this.listeners.main && (this.DOM.input.addEventListener(this.isIE ? "keydown" : "input", i[this.isIE ? "onInputIE" : "onInput"].bind(this)), this.settings.isJQueryPlugin && a(this.DOM.originalInput).on("tagify.removeAllTags", this.removeAllTags.bind(this))), t = this.listeners.main = this.listeners.main || {
                        paste: ["input", i.onPaste.bind(this)],
                        focus: ["input", i.onFocusBlur.bind(this)],
                        blur: ["input", i.onFocusBlur.bind(this)],
                        keydown: ["input", i.onKeydown.bind(this)],
                        click: ["scope", i.onClickScope.bind(this)],
                        dblclick: ["scope", i.onDoubleClickScope.bind(this)]
                    }) this.DOM[t[n][0]][s](n, t[n][1])
            },
            callbacks: {
                onFocusBlur: function(t) {
                    var e = t.target.textContent.trim();
                    "mix" != this.settings.mode && ("focus" == t.type ? (this.DOM.scope.classList.add("tagify--focus"), 0 === this.settings.dropdown.enabled && this.dropdown.show.call(this)) : "blur" == t.type ? (this.DOM.scope.classList.remove("tagify--focus"), e && this.settings.addTagOnBlur && this.addTags(e, !0).length) : (this.DOM.input.removeAttribute("style"), this.dropdown.hide.call(this)))
                },
                onKeydown: function(t) {
                    var e, i, s = this,
                        n = t.target.textContent;
                    if ("mix" == this.settings.mode) {
                        switch (t.key) {
                            case "Backspace":
                                var a = [];
                                i = this.DOM.input.children, setTimeout(function() {
                                    [].forEach.call(i, function(t) {
                                        return a.push(t.title)
                                    }), s.value = s.value.filter(function(t) {
                                        return -1 != a.indexOf(t.title)
                                    })
                                }, 20)
                        }
                        return !0
                    }
                    switch (t.key) {
                        case "Backspace":
                            "" != n && 8203 != n.charCodeAt(0) || (e = (e = this.DOM.scope.querySelectorAll("tag:not(.tagify--hide):not([readonly])"))[e.length - 1], this.removeTag(e));
                            break;
                        case "Esc":
                        case "Escape":
                            this.input.set.call(this), t.target.blur();
                            break;
                        case "ArrowRight":
                        case "Tab":
                            if (!n) return !0;
                        case "Enter":
                            t.preventDefault(), this.addTags(this.input.value, !0)
                    }
                },
                onInput: function(t) {
                    var e = this.input.normalize.call(this),
                        i = e.length >= this.settings.dropdown.enabled;
                    if ("mix" == this.settings.mode) return this.events.callbacks.onMixTagsInput.call(this, t);
                    e ? this.input.value != e && (this.input.set.call(this, e, !1), this.trigger("input", e), -1 != e.search(this.settings.delimiters) ? this.addTags(e).length && this.input.set.call(this) : 0 <= this.settings.dropdown.enabled && this.dropdown[i ? "show" : "hide"].call(this, e)) : this.input.set.call(this, "")
                },
                onMixTagsInput: function(t) {
                    var e, i, s, n, a;
                    window.getSelection && 0 < (e = window.getSelection()).rangeCount && ((i = e.getRangeAt(0).cloneRange()).collapse(!0), i.setStart(window.getSelection().focusNode, 0), (n = (s = i.toString().split(this.settings.mixTagsAllowedAfter))[s.length - 1].match(this.settings.pattern)) && (this.state.tag = {
                        prefix: n[0],
                        value: n.input.split(n[0])[1]
                    }, n = this.state.tag, a = this.state.tag.value.length >= this.settings.dropdown.enabled)), this.update(), this.trigger("input", this.extend({}, this.state.tag, {
                        textContent: this.DOM.input.textContent
                    })), this.state.tag && this.dropdown[a ? "show" : "hide"].call(this, this.state.tag.value)
                },
                onInputIE: function(t) {
                    var e = this;
                    setTimeout(function() {
                        e.events.callbacks.onInput.call(e, t)
                    })
                },
                onPaste: function(t) {},
                onClickScope: function(t) {
                    var e, i = t.target.closest("tag");
                    "TAGS" == t.target.tagName ? this.DOM.input.focus() : "X" == t.target.tagName ? this.removeTag(t.target.parentNode) : i && (e = this.getNodeIndex(i), this.trigger("click", {
                        tag: i,
                        index: e,
                        data: this.value[e]
                    }))
                },
                onEditTagInput: function(t) {
                    var e = t.closest("tag"),
                        i = this.input.normalize(t),
                        s = i == t.originalValue || this.validateTag(i);
                    e.classList.toggle("tagify--invalid", !0 !== s), e.isValid = s, this.trigger("input", i)
                },
                onEditTagBlur: function(t) {
                    var e, i = t.closest("tag"),
                        s = this.getNodeIndex(i),
                        n = this.input.normalize(t) || t.originalValue,
                        a = i.isValid;
                    void 0 !== a && !0 !== a || (t.textContent = n, this.value[s].value = n, this.update(), (e = t.cloneNode(!0)).removeAttribute("contenteditable"), i.title = n, i.classList.remove("tagify--editable"), t.parentNode.replaceChild(e, t))
                },
                onEditTagkeydown: function(t) {
                    switch (t.key) {
                        case "Esc":
                        case "Escape":
                            t.target.textContent = t.target.originalValue;
                        case "Enter":
                            t.preventDefault(), t.target.blur()
                    }
                },
                onDoubleClickScope: function(t) {
                    var e = t.target.closest("tag"),
                        i = this.settings;
                    "mix" == i.mode || i.readonly || i.enforceWhitelist || !e || e.classList.contains("tagify--editable") || e.hasAttribute("readonly") || this.editTag(e)
                }
            }
        },
        editTag: function(t) {
            var e = this,
                i = t.querySelector(".tagify__tag-text"),
                s = this.events.callbacks;
            i ? (t.classList.add("tagify--editable"), i.originalValue = i.textContent, i.setAttribute("contenteditable", !0), i.addEventListener("blur", s.onEditTagBlur.bind(this, i)), i.addEventListener("input", s.onEditTagInput.bind(this, i)), i.addEventListener("keydown", function(t) {
                return s.onEditTagkeydown.call(e, t)
            }), i.focus()) : console.warn("Cannot find element in Tag template: ", ".tagify__tag-text")
        },
        input: {
            value: "",
            set: function() {
                var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "",
                    e = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
                this.input.value = t, e && (this.DOM.input.innerHTML = t), t || this.dropdown.hide.call(this), t.length < 2 && this.input.autocomplete.suggest.call(this, ""), this.input.validate.call(this)
            },
            setRangeAtStartEnd: function() {
                var t, e, i = 0 < arguments.length && void 0 !== arguments[0] && arguments[0],
                    s = arguments[1];
                document.createRange && ((t = document.createRange()).selectNodeContents(s || this.DOM.input), t.collapse(i), (e = window.getSelection()).removeAllRanges(), e.addRange(t))
            },
            validate: function() {
                var t = !this.input.value || this.validateTag.call(this, this.input.value);
                this.DOM.input.classList.toggle("tagify__input--invalid", !0 !== t)
            },
            normalize: function() {
                return (0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : this.DOM.input).innerText.replace(/\s/g, " ").replace(/^\s+/, "")
            },
            autocomplete: {
                suggest: function(t) {
                    t && this.input.value ? this.DOM.input.setAttribute("data-suggest", t.substring(this.input.value.length)) : this.DOM.input.removeAttribute("data-suggest")
                },
                set: function(t) {
                    var e = this.DOM.input.getAttribute("data-suggest"),
                        i = t || (e ? this.input.value + e : null);
                    return !!i && (this.input.set.call(this, i), this.input.autocomplete.suggest.call(this, ""), this.dropdown.hide.call(this), this.input.setRangeAtStartEnd.call(this), !0)
                }
            }
        },
        getNodeIndex: function(t) {
            for (var e = 0; t = t.previousElementSibling;) e++;
            return e
        },
        isTagDuplicate: function(e) {
            return this.value.findIndex(function(t) {
                return e.trim().toLowerCase() === t.value.toLowerCase()
            })
        },
        getTagIndexByValue: function(i) {
            var s = [];
            return this.DOM.scope.querySelectorAll("tag").forEach(function(t, e) {
                t.textContent.trim().toLowerCase() == i.toLowerCase() && s.push(e)
            }), s
        },
        getTagElmByValue: function(t) {
            var e = this.getTagIndexByValue(t)[0];
            return this.DOM.scope.querySelectorAll("tag")[e]
        },
        markTagByValue: function(t, e) {
            return !!(e = e || this.getTagElmByValue(t)) && (e.classList.add("tagify--mark"), setTimeout(function() {
                e.classList.remove("tagify--mark")
            }, 100), e)
        },
        isTagBlacklisted: function(e) {
            return e = e.toLowerCase().trim(), console.log(e), this.settings.blacklist.filter(function(t) {
                return e == t.toLowerCase()
            }).length
        },
        isTagWhitelisted: function(e) {
            return this.settings.whitelist.some(function(t) {
                if ((t.value || t).toLowerCase() === e.toLowerCase()) return !0
            })
        },
        validateTag: function(t) {
            var e = t.trim(),
                i = this.value.length >= this.settings.maxTags,
                s = !0;
            return e ? i ? s = this.TEXTS.exceed : this.settings.pattern && !this.settings.pattern.test(e) ? s = this.TEXTS.pattern : this.settings.duplicates || -1 === this.isTagDuplicate(e) ? (this.isTagBlacklisted(e) || this.settings.enforceWhitelist && !this.isTagWhitelisted(e)) && (s = this.TEXTS.notAllowed) : s = this.TEXTS.duplicate : s = this.TEXTS.empty, s
        },
        normalizeTags: function(t) {
            var i = this,
                e = this.settings.whitelist[0] instanceof Object,
                s = t instanceof Array && t[0] instanceof Object && "value" in t[0],
                n = [];
            if (s) return t;
            if ("number" == typeof t && (t = t.toString()), "string" == typeof t) {
                if (!t.trim()) return [];
                t = t.split(this.settings.delimiters).filter(function(t) {
                    return t
                }).map(function(t) {
                    return {
                        value: t.trim()
                    }
                })
            } else t instanceof Array && (t = t.map(function(t) {
                return {
                    value: t.trim()
                }
            }));
            return e ? (t.forEach(function(e) {
                var t = i.settings.whitelist.filter(function(t) {
                    return t.value.toLowerCase() == e.value.toLowerCase()
                });
                t[0] ? n.push(t[0]) : "mix" != i.settings.mode && n.push(e)
            }), n) : t
        },
        parseMixTags: function(s) {
            var n = this;
            return s.split(this.settings.mixTagsAllowedAfter).filter(function(t) {
                return t.match(n.settings.pattern)
            }).forEach(function(t) {
                var e, i = t.replace(n.settings.pattern, "");
                n.isTagWhitelisted(i) && (e = n.normalizeTags.call(n, i)[0], s = n.replaceMixStringWithTag(s, t, e).s)
            }), this.DOM.input.innerHTML = s, this.update(), s
        },
        replaceMixStringWithTag: function(t, e, i, s) {
            return i && t && -1 != t.indexOf(e) && (s = this.createTagElem(i), this.value.push(i), t = t.replace(e, s.outerHTML + "&#8288;")), {
                s: t,
                tagElm: s
            }
        },
        addMixTag: function(t) {
            if (t && this.state.tag) {
                for (var e, i, s, n, a = this.state.tag.prefix + this.state.tag.value, o = document.createNodeIterator(this.DOM.input, NodeFilter.SHOW_TEXT); e = o.nextNode();)
                    if (e.nodeType === Node.TEXT_NODE) {
                        if (-1 == (s = e.nodeValue.indexOf(a))) continue;
                        n = e.splitText(s), i = this.createTagElem(t), n.nodeValue = n.nodeValue.replace(a, ""), e.parentNode.insertBefore(i, n), i.insertAdjacentHTML("afterend", "&#8288;")
                    }
                i && (this.value.push(t), this.update(), this.trigger("add", this.extend({}, {
                    index: this.value.length,
                    tag: i
                }, t))), this.state.tag = null
            }
        },
        addTags: function(t, e) {
            var s = this,
                n = [];
            if (t = this.normalizeTags.call(this, t), "mix" == this.settings.mode) return this.addMixTag(t[0]);
            return this.DOM.input.removeAttribute("style"), t.forEach(function(t) {
                var e, i;
                t = Object.assign({}, t), "function" == typeof s.settings.transformTag && (t.value = s.settings.transformTag.call(s, t.value) || t.value), !0 !== (e = s.validateTag.call(s, t.value)) && (t.class = t.class ? t.class + " tagify--notAllowed" : "tagify--notAllowed", t.title = e, s.markTagByValue(t.value), s.trigger("invalid", {
                        data: t,
                        index: s.value.length,
                        message: e
                    })), i = s.createTagElem(t), n.push(i),
                    function(t) {
                        var e = this.DOM.scope.lastElementChild;
                        e === this.DOM.input ? this.DOM.scope.insertBefore(t, e) : this.DOM.scope.appendChild(t)
                    }.call(s, i), !0 === e ? (s.value.push(t), s.update(), s.DOM.scope.classList.toggle("hasMaxTags", s.value.length >= s.settings.maxTags), s.trigger("add", {
                        tag: i,
                        index: s.value.length - 1,
                        data: t
                    })) : s.settings.keepInvalidTags || setTimeout(function() {
                        s.removeTag(i, !0)
                    }, 1e3)
            }), t.length && e && this.input.set.call(this), n
        },
        minify: function(t) {
            return t.replace(new RegExp(">[\r\n ]+<", "g"), "><")
        },
        createTagElem: function(t) {
            var e, i = this.escapeHtml(t.value),
                s = "<tag title='" + i + "' contenteditable='false' spellcheck=\"false\">\n                            <x title=''></x><div><span class='tagify__tag-text'>" + i + "</span></div>\n                        </tag>";
            if ("function" == typeof this.settings.tagTemplate) try {
                s = this.settings.tagTemplate(i, t)
            } catch (t) {}
            return this.settings.readonly && (t.readonly = !0), s = this.minify(s),
                function(t, e) {
                    var i, s = Object.keys(e);
                    for (i = s.length; i--;) {
                        var n = s[i];
                        if (!e.hasOwnProperty(n)) return;
                        t.setAttribute(n, e[n])
                    }
                }(e = this.parseHTML(s), t), e
        },
        removeTag: function(t, e) {
            var i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 250;
            if (t && t instanceof HTMLElement) {
                "string" == typeof t && (t = this.getTagElmByValue(t));
                var s, n = this.getNodeIndex(t);
                i && 10 < i ? (t.style.width = parseFloat(window.getComputedStyle(t).width) + "px", document.body.clientTop, t.classList.add("tagify--hide"), setTimeout(a, 400)) : a(), e || (s = this.value.splice(n, 1)[0], this.update(), this.trigger("remove", {
                    tag: t,
                    index: n,
                    data: s
                }))
            }

            function a() {
                t.parentNode && t.parentNode.removeChild(t)
            }
        },
        removeAllTags: function() {
            this.value = [], this.update(), Array.prototype.slice.call(this.DOM.scope.querySelectorAll("tag")).forEach(function(t) {
                return t.parentNode.removeChild(t)
            })
        },
        update: function() {
            this.DOM.originalInput.value = "mix" == this.settings.mode ? this.DOM.input.textContent : JSON.stringify(this.value)
        },
        dropdown: {
            init: function() {
                this.DOM.dropdown = this.dropdown.build.call(this)
            },
            build: function() {
                var t = '<div class="' + ("tagify__dropdown " + this.settings.dropdown.classname).trim() + '"></div>';
                return this.parseHTML(t)
            },
            show: function(t) {
                var e, i = this;
                if (this.settings.whitelist.length) {
                    if (this.suggestedListItems = t ? this.dropdown.filterListItems.call(this, t) : this.settings.whitelist.filter(function(t) {
                            return -1 == i.isTagDuplicate(t.value || t)
                        }), !this.suggestedListItems.length) return this.input.autocomplete.suggest.call(this), void this.dropdown.hide.call(this);
                    e = this.dropdown.createListHTML.call(this, this.suggestedListItems), this.settings.autoComplete && this.input.autocomplete.suggest.call(this, this.suggestedListItems.length ? this.suggestedListItems[0].value : ""), this.DOM.dropdown.innerHTML = e, this.dropdown.position.call(this), !this.DOM.dropdown.parentNode != document.body && (document.body.appendChild(this.DOM.dropdown), this.events.binding.call(this, !1), this.dropdown.events.binding.call(this))
                }
            },
            hide: function() {
                this.DOM.dropdown && this.DOM.dropdown.parentNode == document.body && (document.body.removeChild(this.DOM.dropdown), window.removeEventListener("resize", this.dropdown.position), this.dropdown.events.binding.call(this, !1), this.events.binding.call(this))
            },
            position: function() {
                var t = this.DOM.scope.getBoundingClientRect();
                this.DOM.dropdown.style.cssText = "left: " + (t.left + window.pageXOffset) + "px;                                                top: " + (t.top + t.height - 1 + window.pageYOffset) + "px;                                                width: " + t.width + "px"
            },
            events: {
                binding: function() {
                    var t = !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0],
                        e = this.listeners.dropdown = this.listeners.dropdown || {
                            position: this.dropdown.position.bind(this),
                            onKeyDown: this.dropdown.events.callbacks.onKeyDown.bind(this),
                            onMouseOver: this.dropdown.events.callbacks.onMouseOver.bind(this),
                            onClick: this.dropdown.events.callbacks.onClick.bind(this)
                        },
                        i = t ? "addEventListener" : "removeEventListener";
                    window[i]("resize", e.position), window[i]("keydown", e.onKeyDown), window[i]("mousedown", e.onClick), this.DOM.dropdown[i]("mouseover", e.onMouseOver)
                },
                callbacks: {
                    onKeyDown: function(t) {
                        var e = this.DOM.dropdown.querySelectorAll("[class$='--active']")[0],
                            i = "";
                        switch (t.key) {
                            case "ArrowDown":
                            case "ArrowUp":
                            case "Down":
                            case "Up":
                                t.preventDefault(), e && (e = e[("ArrowUp" == t.key || "Up" == t.key ? "previous" : "next") + "ElementSibling"]), e || (e = this.DOM.dropdown.children["ArrowUp" == t.key || "Up" == t.key ? this.DOM.dropdown.children.length - 1 : 0]), this.dropdown.highlightOption.call(this, e, !0);
                                break;
                            case "Escape":
                            case "Esc":
                                this.dropdown.hide.call(this);
                                break;
                            case "ArrowRight":
                            case "Tab":
                                if (t.preventDefault(), !this.input.autocomplete.set.call(this, e ? e.textContent : null)) return !1;
                            case "Enter":
                                return t.preventDefault(), i = this.suggestedListItems[this.getNodeIndex(e)] || this.input.value, this.addTags([i], !0), this.dropdown.hide.call(this), !1
                        }
                    },
                    onMouseOver: function(t) {
                        t.target.className.includes("__item") && this.dropdown.highlightOption.call(this, t.target)
                    },
                    onClick: function(t) {
                        var e, i, s = this,
                            n = function() {
                                return s.dropdown.hide.call(s)
                            };
                        if (0 == t.button) {
                            if (t.target == document.documentElement) return n();
                            (i = [t.target, t.target.parentNode].filter(function(t) {
                                return t.className.includes("tagify__dropdown__item")
                            })[0]) ? (e = this.suggestedListItems[this.getNodeIndex(i)] || this.input.value, this.addTags([e], !0), this.dropdown.hide.call(this)) : n()
                        }
                    }
                }
            },
            highlightOption: function(t, e) {
                if (t) {
                    var i = "tagify__dropdown__item--active";
                    [].forEach.call(this.DOM.dropdown.querySelectorAll("[class$='--active']"), function(t) {
                        return t.classList.remove(i)
                    }), t.classList.add(i), e && (t.parentNode.scrollTop = t.clientHeight + t.offsetTop - t.parentNode.clientHeight)
                }
            },
            filterListItems: function(t) {
                if (!t) return "";
                for (var e, i = [], s = this.settings.whitelist, n = this.settings.dropdown.maxItems || 1 / 0, a = 0; a < s.length && (0 == (e = s[a] instanceof Object ? s[a] : {
                        value: s[a]
                    }).value.toLowerCase().indexOf(t.toLowerCase()) && -1 == this.isTagDuplicate(e.value) && n-- && i.push(e), 0 != n); a++);
                return i
            },
            createListHTML: function(t) {
                var e = this.settings.dropdown.itemTemplate || function(t) {
                    return "<div class='tagify__dropdown__item " + (t.class ? t.class : "") + "' " + function(t) {
                        var e, i = Object.keys(t),
                            s = "";
                        for (e = i.length; e--;) {
                            var n = i[e];
                            if ("class" != n && !t.hasOwnProperty(n)) return;
                            s += " " + n + (t[n] ? "=" + t[n] : "")
                        }
                        return s
                    }(t) + ">" + (t.value || t) + "</div>"
                };
                return t.map(e).join("")
            }
        }
    }
}(jQuery);
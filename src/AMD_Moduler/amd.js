const moduleCache = {}
const moduleMap = {}
function define(url, deps, callback) {
    const len = deps.length
    let i = 0
    let depCount = len
    const params = []
    if (len > 0) {
        while (i < len) {
            const dep = deps[i]
            loadModule(moduleMap[dep] ? moduleMap[dep] : dep, function(depResult) {
                params[depCount - 1] = depResult
                params.length = i + 1
                depCount--
                if (depCount === 0) {
                    setModule(moduleMap[url] ? moduleMap[url] : url, params, callback)
                }
            })
            i++
        }
    } else {
        setModule(moduleMap[url] ? moduleMap[url] : url, params, callback)
    }
}

function loadModule(moduleName, callback) {
    let module
    if (module = moduleCache[moduleName]) {
        if (module.status === 'load') {
            setTimeout(callback, 0)
        } else {
            module.onload.push(callback)
        }
    } else {
        module = moduleCache[moduleName] = {
            status: 'loading',
            onload: [callback],
            export: {}
        }
        loadScript(moduleName)
    }
}

function loadScript(url, callback) {
    const script = document.createElement('script')
    script.async = true
    script.src =  url
    document.body.appendChild(script)
}

function setModule(moduleName, deps, callback) {
    let module 
    if (moduleCache[moduleName]) {
        module = moduleCache[moduleName]
        module.status = 'load'
        module.export = callback ? callback.call(this, ...deps) : void 0;
        let fn
        while (fn = module.onload.pop()) {
            fn(module.export)
        }
    } else {
        callback.call(this, ...deps)
    }
}
function setConfig(config = {}) {
    for (const key in config) {
        moduleMap[key] = config[key]
    }
}

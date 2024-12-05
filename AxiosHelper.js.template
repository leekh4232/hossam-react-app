import axios from 'axios';

const axiosHelper = {
    ajax: async function (url, method, formData, headers={}) {
        let response = null;

        try {
            switch (method.toLowerCase()) {
                case "get":
                    let data = null;
                    try {
                        data = Object.fromEntries(formData);
                    } catch (e) {
                        data = formData;
                    }

                    response = await axios.get(url, {
                        params: data,
                        headers: headers
                    });
                    break;
                case "post":
                    response = await axios.post(url, formData, {
                        headers: headers
                    });
                    break;
                case "put":
                    response = await axios.put(url, formData, {
                        headers: headers
                    });
                    break;
                case "delete":
                    response = await axios.delete(url, {
                        data: formData,
                        headers: headers
                    });
                    break;
            }
        } catch (error) {
            const response = error.response;
            const data = response?.data;

            const e = new Error(data?.message || response?.statusText || "An error occurred in the Axios.");
            e.status = data?.status || response?.status || 0;
            e.statusText = data?.message || response?.statusText || "Unknown Error";
            e.trace = data?.trace || response?.trace || "No trace information";

            console.group(`axiosHelper::ajax --> ${e.status} Error, ${e.statusText}`);
            console.error(e.trace);
            console.groupEnd();

            throw e;
        }

        return response?.data;
    },
    get: async function (url, formData, headers = {}) {
        return await this.ajax(url, "get", formData, headers);
    },
    post: async function (url, formData, headers = {}) {
        return await this.ajax(url, "post", formData, headers);
    },
    put: async function (url, formData, headers = {}) {
        return await this.ajax(url, "put", formData, headers);
    },
    delete: async function (url, formData, headers = {}) {
        return await this.ajax(url, "delete", formData, headers);
    }
}

export default axiosHelper;
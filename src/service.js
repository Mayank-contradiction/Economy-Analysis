const API_ROOT = process.env.REACT_APP_API_ROOT;
const accessToken = process.env.REACT_APP_ACCESS_TOKEN;

export const getCountryData = async (countryName) => {
    try{
        const response = await fetch(`${API_ROOT}country/${countryName}?c=${accessToken}`, {
            method: 'GET'
        });
        if(response.status === 200){
            const data = await response.json();
            let adjustedData = data.reduce(function(acc,curr){
                if(acc[curr.Country]){
                    if(!(curr.CategoryGroup in acc[curr.Country])){
                        acc[curr.Country][curr.CategoryGroup]=[];
                    }
                    acc[curr.Country][curr.CategoryGroup].push(curr);
                }
                else{
                    acc[curr.Country]={}
                    if(!(curr.CategoryGroup in acc[curr.Country])){
                        acc[curr.Country][curr.CategoryGroup]=[];
                    }
                    acc[curr.Country][curr.CategoryGroup].push(curr);
                }
                return acc;
            },{});
            return adjustedData;
        
        }
    }catch(error) {
        console.log(error);
        return error
    }
}

export const getCdataBySI = async (countryName, indicator) => {
    try{
        const response = await fetch(`${API_ROOT}country/${countryName}/${indicator}?c=${accessToken}`, {
            method: 'GET'
        });
        if(response.status === 200){
            const data = await response.json();
            let adjustedData = data.reduce(function(acc,curr){
                if(acc[curr.Category]){
                    acc[curr.Category].push(curr);
                }
                else{
                    acc[curr.Category]=[]
                    acc[curr.Category].push(curr);
                }
                return acc;
            },{});
            return adjustedData;
        }
    }catch(error) {
        console.log(error);
        return error;
    }
}

export const getIndicators = async () => {
    try{
        const response = await fetch(`${API_ROOT}indicators?c=${accessToken}`, {
            method: 'GET'
        });
        if(response.status === 200){
            const data = await response.json();
            let adjustedData = data.reduce(function(acc,curr){
                if(acc[curr.CategoryGroup]){
                    acc[curr.CategoryGroup].push(curr);
                }
                else{
                    acc[curr.CategoryGroup]=[]
                    acc[curr.CategoryGroup].push(curr);
                }
                return acc;
            },{});
            return adjustedData;
        }
    }catch(error) {
        console.log(error);
        return error
    }
}
const API = 'https://acme-users-api-rev.herokuapp.com/api';

let productsData;

const getProductOfferings = (products, companies, offerings) => {
    productsData = products.map(({ id, name, description, suggestedPrice }) => {
        const productOfferings = offerings.filter(offering => offering.productId === id)
            .map(({price, companyId}) => ({ price, companyName: companies.find(company => company.id === companyId).name }))
        return { id, name, description, suggestedPrice, productOfferings };
    })
    console.log(productsData)
}

const loadData = () => {
    Promise.all([fetch(`${API}/products`), fetch(`${API}/companies`), fetch(`${API}/offerings`)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([products, companies, offerings]) => { getProductOfferings(products, companies, offerings) });
};

loadData();

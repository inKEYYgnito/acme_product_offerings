const API = 'https://acme-users-api-rev.herokuapp.com/api';

let productOfferings;

const render = (products) => {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => {
        return `<div>
                    <h2 data-id="${product.id}">${product.name}</h2>
                    <p>${product.description}</p>
                    <p>$${product.suggestedPrice.toFixed(2)}</p>
                    <ul>
                        ${product.productOfferings.map(offering => 
                            `<li>Offered by: ${offering.companyName} at $${offering.price.toFixed(2)}</li>`
                        ).join('')}
                    </ul>
                </div>`;
    }).join('');

    document.querySelectorAll('h2').forEach(h2 => {
        h2.addEventListener('click', (event) => {
            window.location.hash = event.target.dataset.id;
        });
    });
};

const getProductOfferings = (products, companies, offerings) => {
    return products.map(({ id, name, description, suggestedPrice }) => {
        const productOfferings = offerings.filter(offering => offering.productId === id)
            .map(({price, companyId}) => ({ price, companyName: companies.find(company => company.id === companyId).name }));
        return { id, name, description, suggestedPrice, productOfferings };
    })
}

const loadData = () => {
    Promise.all([fetch(`${API}/products`), fetch(`${API}/companies`), fetch(`${API}/offerings`)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([products, companies, offerings]) => { 
            productOfferings = getProductOfferings(products, companies, offerings);
            render(productOfferings);
        });
};

loadData();

window.addEventListener('hashchange', (event) => {
    const product = productOfferings.find(product => product.id === location.hash.slice(1));
    render([product]);
});

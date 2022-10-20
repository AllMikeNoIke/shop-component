import { useEffect, useState } from 'react'
import './sass/components/App.css'

enum ItemName {
  CAPSULE = 'FLO - PMS Vitamin Capsule',
  GUMMIES = 'FLO - PMS Gummy Vitamins',
}

enum PurchaseType {
  SUBSCRIPTION = 'Subscription (every month)',
  ONE_TIME = 'One time',
}

enum Count {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

interface Cart {
  itemName: string
  purchaseType: string
  count: number
}

const pricingByPurchaseTypeAndQuantity = {
  [PurchaseType.SUBSCRIPTION]: {
    1: 26.99,
    2: 24.99,
    3: 24,
  },
  [PurchaseType.ONE_TIME]: {
    1: 31.99,
    2: 26.99,
    3: 26,
  },
}

const upsellItem = {
  itemName: 'DISCO Multivitamin',
  imgSrc:
    'https://cdn.shopify.com/s/files/1/0013/1068/7335/files/OPProducts_DISCO-200x200.png?v=1663192704',
  price: 31.99,
  pricePromotional: 26.99,
}

const getCartTotal = (
  purchaseType: PurchaseType,
  count: Count,
  getOriginalTotal = false
) => {
  const price = getOriginalTotal
    ? pricingByPurchaseTypeAndQuantity[purchaseType][1]
    : pricingByPurchaseTypeAndQuantity[purchaseType][count]

  return price * count
}

const getUpdatedItemName = (
  itemName: ItemName,
  purchaseType: PurchaseType,
  count: Count
) => {
  if (purchaseType === PurchaseType.ONE_TIME) {
    return itemName
  } else {
    if (count > 1) {
      return `FLO ${
        itemName === ItemName.CAPSULE ? 'Capsules' : 'Gummies'
      } - ${count} Bottle Sub`
    }
    return itemName
  }
}

const getUpdatedPurchaseType = (purchaseType: PurchaseType, count: Count) => {
  if (purchaseType === PurchaseType.ONE_TIME) {
    return purchaseType
  } else {
    if (count === 1) {
      return PurchaseType.SUBSCRIPTION
    }
    return `Subscription (every ${count} months)`
  }
}

const getUpdatedCart = (cart: Cart[], itemToBeAdded: Cart) => {
  const itemAlreadyInCart = cart.find(
    (item) =>
      item.itemName === itemToBeAdded.itemName &&
      item.purchaseType === itemToBeAdded.purchaseType
  )

  if (itemAlreadyInCart) {
    const updatedItemInCart = {
      ...itemAlreadyInCart,
      count: itemAlreadyInCart.count + itemToBeAdded.count,
    }
    return cart.map((item) =>
      item !== itemAlreadyInCart ? item : updatedItemInCart
    )
  } else {
    return [...cart, itemToBeAdded]
  }
}

const App = () => {
  const [itemName, setItemName] = useState<ItemName>(ItemName.CAPSULE)
  const [purchaseType, setPurchaseType] = useState<PurchaseType>(
    PurchaseType.SUBSCRIPTION
  )
  const [count, setCount] = useState<Count>(Count.ONE)
  const [cart, setCart] = useState<Cart[]>([])
  const [isUpsellItemSelected, setIsUpsellItemSelected] = useState(false)

  const handleAddToCart = () => {
    const itemToBeAdded = {
      count,
      itemName: getUpdatedItemName(itemName, purchaseType, count) as string,
      purchaseType: getUpdatedPurchaseType(purchaseType, count),
    }

    let updatedCart = getUpdatedCart(cart, itemToBeAdded)

    if (isUpsellItemSelected) {
      const upsellItemToBeAdded = {
        count: 1,
        itemName: upsellItem.itemName,
        purchaseType: PurchaseType.ONE_TIME,
      }
      updatedCart = getUpdatedCart(updatedCart, upsellItemToBeAdded)
    }

    setCart(updatedCart)
  }

  const handleClickLearnMore = () => {
    alert('learn more button clicked!')
  }

  useEffect(() => {
    if (cart.length > 0) {
      alert(
        `Item Name | Type | Count\n${cart
          .map(
            (item) =>
              `${item.itemName} | ${item.purchaseType} | ${item.count}\n`
          )
          .join('')}`
      )
    }
  }, [cart])

  return (
    <div className="container">
      <div className="shop-card">
        <div className="shop-card-section">
          <div className="section-header">
            <p>1.</p>
            <p>Select Option</p>
          </div>

          <div className="section-info">
            <div className="section-option-container">
              <div className="section-option">
                <input
                  type="radio"
                  value="gummies"
                  id="gummies"
                  name="item-type"
                  checked={itemName === ItemName.GUMMIES}
                  onChange={() => setItemName(ItemName.GUMMIES)}
                />
                <label htmlFor="gummies">Gummies</label>
              </div>
              <p className="section-option-info">Strawberry</p>
            </div>

            <div className="section-option-container item-name">
              <div className="section-option">
                <input
                  type="radio"
                  value="capsule"
                  id="capsule"
                  name="item-type"
                  checked={itemName === ItemName.CAPSULE}
                  onChange={() => setItemName(ItemName.CAPSULE)}
                />
                <label htmlFor="capsule">Capsule</label>
              </div>
              <p className="section-option-info">Sugar-Free</p>
            </div>
          </div>
        </div>

        <div className="shop-card-section">
          <div className="section-header">
            <p>2.</p>
            <p>Purchase Type:</p>
          </div>
          <div className="purchasing-section-info">
            <div className="purchasing-section-option-container">
              <div>
                <div className="section-option">
                  <input
                    type="radio"
                    value="subscription"
                    id="subscription"
                    name="purchase-type"
                    checked={purchaseType === PurchaseType.SUBSCRIPTION}
                    onChange={() => setPurchaseType(PurchaseType.SUBSCRIPTION)}
                  />
                  <label
                    className="purchasing-section-option-title"
                    htmlFor="subscription"
                  >
                    Subscribe & Save
                  </label>
                </div>
                <div>
                  <p className="section-option-info">Easy to cancel, anytime</p>
                  <p className="section-option-info free-shipping">
                    Free Shipping Always
                  </p>
                </div>
              </div>

              <div className="purchasing-section-option-container-pricing">
                <p className="purchasing-section-option-pricing">
                  $
                  {
                    pricingByPurchaseTypeAndQuantity[PurchaseType.SUBSCRIPTION][
                      count
                    ]
                  }
                </p>
                <p className="section-option-info">/BOTTLE</p>
              </div>
            </div>

            <div className="purchasing-section-option-container">
              <div>
                <div className="section-option">
                  <input
                    type="radio"
                    value="one-time"
                    id="one-time"
                    name="purchase-type"
                    checked={purchaseType === PurchaseType.ONE_TIME}
                    onChange={() => setPurchaseType(PurchaseType.ONE_TIME)}
                  />
                  <label
                    className="purchasing-section-option-title"
                    htmlFor="one-time"
                  >
                    One Time
                  </label>
                </div>
                <div>
                  <p className="section-option-info">One Time Purchase</p>
                </div>
              </div>
              <div className="purchasing-section-option-container-pricing">
                <p className="purchasing-section-option-pricing">
                  $
                  {
                    pricingByPurchaseTypeAndQuantity[PurchaseType.ONE_TIME][
                      count
                    ]
                  }
                </p>
                <p className="section-option-info">/BOTTLE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shop-card-section quantity">
          <div className="quantity-section-option">
            <div className="section-header">
              <p>3.</p>
              <p>Quantity</p>
            </div>

            <div>
              <button
                className={`quantity-btn ${
                  count === Count.ONE && 'quantity-btn-active'
                }`}
                onClick={(event) => {
                  event.preventDefault()
                  setCount(Count.ONE)
                }}
              >
                1
              </button>
              <button
                className={`quantity-btn ${
                  count === Count.TWO && 'quantity-btn-active'
                }`}
                onClick={(event) => {
                  event.preventDefault()
                  setCount(Count.TWO)
                }}
              >
                2
              </button>
              <button
                className={`quantity-btn ${
                  count === Count.THREE && 'quantity-btn-active'
                }`}
                onClick={(event) => {
                  event.preventDefault()
                  setCount(Count.THREE)
                }}
              >
                3
              </button>
            </div>
          </div>
          <div>
            {purchaseType === PurchaseType.SUBSCRIPTION && (
              <div>
                {count === 3 && (
                  <p className="section-option-info">
                    Congrats, you've selected our best value!
                  </p>
                )}
                <p className="section-option-info quantity-sent-info">
                  {count} {count > 1 ? 'bottles ship' : 'bottle ships'} every
                  month
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="upsell-shop-card-section">
          <div className="section-header">
            <p>4.</p>
            <p>Frequently Bought With:</p>
          </div>
          <div className="section-info upsell">
            <div className="section-option">
              <input
                type="checkbox"
                id="upsell-item"
                onChange={(event) =>
                  setIsUpsellItemSelected(event.target.checked)
                }
              />
              <label htmlFor="upsell-item"></label>
            </div>
            <img
              src="https://cdn.shopify.com/s/files/1/0013/1068/7335/files/OPProducts_DISCO-200x200.png?v=1663192704"
              alt="DISCO Multivitamin Bottle"
              width="80"
              height="auto"
            />
            <div className="upsell-info">
              <p className="upsell-section-option-info">
                {upsellItem.itemName}
              </p>
              <p>
                <span className="upsell-section-option-info-price-original">
                  ${upsellItem.price}
                </span>{' '}
                <span className="upsell-section-option-info-price-sale">
                  ${upsellItem.pricePromotional}
                </span>
              </p>
              <div>
                <small className="upsell-section-option-info-icon">
                  &#9432;
                </small>
                <button
                  onClick={handleClickLearnMore}
                  className="upsell-section-option-info-learn-more-btn"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          ADD TO CART -{' '}
          {(purchaseType !== PurchaseType.ONE_TIME || count !== Count.ONE) && (
            <span className="add-to-cart-btn-original-price">
              ${getCartTotal(purchaseType, count, true)}
            </span>
          )}{' '}
          <span className="add-to-cart-btn-promotional-price">
            ${getCartTotal(purchaseType, count)}
          </span>
        </button>
      </div>
      <div className="guarantee-statement">60-day happiness guaranteed</div>
    </div>
  )
}

export default App

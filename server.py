from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Static catalog data ----------

BASE_MODELS = [
    {
        "id": "spark",
        "name": "Phoenix Spark",
        "tier": "Essential",
        "tagline": "1080p domination. Your first serious rig.",
        "base_price": 1299,
        "image": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
        "best_for": "Casual gamers buying their first serious PC",
        "defaults": {"cpu": "r5-7600", "gpu": "rtx-4060", "ram": "16-5200", "storage": "1tb-gen4", "cooling": "air-240"},
    },
    {
        "id": "pyre",
        "name": "Phoenix Pyre",
        "tier": "Advanced",
        "tagline": "1440p ultra. Built for creators who game.",
        "base_price": 2199,
        "image": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
        "best_for": "Streamers and content creators",
        "defaults": {"cpu": "u7-265k", "gpu": "rtx-5070", "ram": "32-6000", "storage": "2tb-gen4", "cooling": "lc-240-argb"},
    },
    {
        "id": "inferno",
        "name": "Phoenix Inferno",
        "tier": "Elite",
        "tagline": "4K uncapped. No compromises, ever.",
        "base_price": 3499,
        "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
        "best_for": "Hardcore gamers chasing max performance",
        "defaults": {"cpu": "r7-9800x3d", "gpu": "rtx-5080", "ram": "64-6000", "storage": "2tb-gen5", "cooling": "lc-360-lcd"},
    },
]

COMPONENT_OPTIONS = {
    "cpu": [
        {"id": "r5-7600", "name": "AMD Ryzen 5 7600", "spec": "6-core · 5.1 GHz boost", "price": 0},
        {"id": "r7-7800x3d", "name": "AMD Ryzen 7 7800X3D", "spec": "8-core · 3D V-Cache", "price": 220},
        {"id": "u7-265k", "name": "Intel Core Ultra 7 265K", "spec": "20-core · 5.5 GHz", "price": 260},
        {"id": "r7-9800x3d", "name": "AMD Ryzen 7 9800X3D", "spec": "8-core · gaming king", "price": 420},
        {"id": "u9-285k", "name": "Intel Core Ultra 9 285K", "spec": "24-core · 5.7 GHz", "price": 560},
    ],
    "gpu": [
        {"id": "rtx-4060", "name": "GeForce RTX 4060", "spec": "8GB GDDR6", "price": 0},
        {"id": "rtx-5060ti", "name": "GeForce RTX 5060 Ti", "spec": "16GB GDDR7", "price": 260},
        {"id": "rtx-5070", "name": "GeForce RTX 5070", "spec": "12GB GDDR7", "price": 540},
        {"id": "rtx-5070ti", "name": "GeForce RTX 5070 Ti", "spec": "16GB GDDR7", "price": 820},
        {"id": "rtx-5080", "name": "GeForce RTX 5080", "spec": "16GB GDDR7", "price": 1240},
        {"id": "rtx-5090", "name": "GeForce RTX 5090", "spec": "32GB GDDR7", "price": 2400},
    ],
    "ram": [
        {"id": "16-5200", "name": "16GB DDR5 5200", "spec": "2x8GB · dual channel", "price": 0},
        {"id": "32-6000", "name": "32GB DDR5 6000", "spec": "2x16GB · CL30", "price": 110},
        {"id": "64-6000", "name": "64GB DDR5 6000", "spec": "2x32GB · CL30", "price": 290},
        {"id": "96-6400", "name": "96GB DDR5 6400", "spec": "2x48GB · creator spec", "price": 480},
    ],
    "storage": [
        {"id": "1tb-gen4", "name": "1TB NVMe Gen4", "spec": "7,000 MB/s reads", "price": 0},
        {"id": "2tb-gen4", "name": "2TB NVMe Gen4", "spec": "7,000 MB/s reads", "price": 110},
        {"id": "2tb-gen5", "name": "2TB NVMe Gen5", "spec": "12,400 MB/s reads", "price": 240},
        {"id": "4tb-gen5", "name": "4TB NVMe Gen5", "spec": "12,400 MB/s reads", "price": 520},
    ],
    "cooling": [
        {"id": "air-240", "name": "Phoenix Air Tower", "spec": "6-heatpipe · quiet", "price": 0},
        {"id": "lc-240-argb", "name": "Phoenix Liquid 240 ARGB", "spec": "AIO · ARGB pump block", "price": 140},
        {"id": "lc-360-argb", "name": "Phoenix Liquid 360 ARGB", "spec": "AIO · triple fan", "price": 220},
        {"id": "lc-360-lcd", "name": "Phoenix Liquid 360 LCD", "spec": "AIO · LCD pump display", "price": 340},
        {"id": "lc-custom", "name": "Phoenix Custom Loop", "spec": "Hardline · dual rad", "price": 690},
    ],
}

PREBUILTS = [
    {
        "id": "pb-ember",
        "name": "Ember R5",
        "chipset": "AMD RYZEN",
        "gpu_chipset": "GeForce RTX 5060 Ti 16GB · Ryzen 5 7600 · 32GB DDR5 · 1TB NVMe",
        "price": 1599,
        "was_price": 1729,
        "badge": "In Stock",
        "rating": "4.9",
        "reviews": 41,
        "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
        "monthly": 54,
        "base_model": "spark",
        "config": {"cpu": "r5-7600", "gpu": "rtx-5060ti", "ram": "32-6000", "storage": "1tb-gen4", "cooling": "lc-240-argb"},
    },
    {
        "id": "pb-blaze",
        "name": "Blaze Ultra",
        "chipset": "INTEL CORE",
        "gpu_chipset": "GeForce RTX 5070 · Core Ultra 7 265K · 32GB DDR5 · 2TB NVMe",
        "price": 2439,
        "was_price": 2619,
        "badge": "Only 4 left",
        "rating": "4.9",
        "reviews": 63,
        "image": "https://images.unsplash.com/photo-1587302912306-cf1ed9c33146?w=800&q=80",
        "monthly": 82,
        "base_model": "pyre",
        "config": {"cpu": "u7-265k", "gpu": "rtx-5070", "ram": "32-6000", "storage": "2tb-gen4", "cooling": "lc-360-argb"},
    },
    {
        "id": "pb-apex",
        "name": "Apex X3D",
        "chipset": "AMD RYZEN",
        "gpu_chipset": "GeForce RTX 5080 · Ryzen 7 9800X3D · 64GB DDR5 · 2TB Gen5",
        "price": 3699,
        "was_price": 3949,
        "badge": "Only 2 left",
        "rating": "5.0",
        "reviews": 18,
        "image": "https://images.unsplash.com/photo-1593152167544-085d3b9c4938?w=800&q=80",
        "monthly": 124,
        "base_model": "inferno",
        "config": {"cpu": "r7-9800x3d", "gpu": "rtx-5080", "ram": "64-6000", "storage": "2tb-gen5", "cooling": "lc-360-lcd"},
    },
    {
        "id": "pb-eternal",
        "name": "Eternal 5090",
        "chipset": "INTEL CORE",
        "gpu_chipset": "GeForce RTX 5090 · Core Ultra 9 285K · 96GB DDR5 · 4TB Gen5",
        "price": 5499,
        "was_price": 5899,
        "badge": "Rare",
        "rating": "5.0",
        "reviews": 9,
        "image": "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=800&q=80",
        "monthly": 183,
        "base_model": "inferno",
        "config": {"cpu": "u9-285k", "gpu": "rtx-5090", "ram": "96-6400", "storage": "4tb-gen5", "cooling": "lc-custom"},
    },
]


# ---------- Models ----------

class OrderCreate(BaseModel):
    order_type: str  # "custom" | "prebuilt"
    build_name: str
    config: Dict[str, Any]
    total_price: float
    customer_name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    phone: Optional[str] = ""
    notes: Optional[str] = ""


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_type: str
    build_name: str
    config: Dict[str, Any]
    total_price: float
    customer_name: str
    email: str
    phone: str = ""
    notes: str = ""
    status: str = "enquiry_received"
    paid_amount: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Payments (Stripe) ----------

import stripe
from fastapi import Request

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY") or "sk_test_emergent"
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
DEPOSIT_AMOUNT = 250.00  # fixed build deposit, server-side only

ORDER_STAGES = ["enquiry_received", "deposit_paid", "paid_in_full", "building", "stress_testing", "shipped"]


class CheckoutRequest(BaseModel):
    order_id: str
    plan: str  # "deposit" | "full"
    origin_url: str


@api_router.post("/payments/checkout")
async def create_checkout(req: CheckoutRequest):
    order = await db.orders.find_one({"id": req.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    if req.plan not in ("deposit", "full"):
        raise HTTPException(400, "Plan must be 'deposit' or 'full'")

    total = float(order["total_price"])
    already_paid = float(order.get("paid_amount", 0))
    if req.plan == "deposit":
        amount = min(DEPOSIT_AMOUNT, total) - already_paid
        label = f"Build deposit — {order['build_name']}"
    else:
        amount = total - already_paid
        label = f"Full payment — {order['build_name']}"
    if amount <= 0:
        raise HTTPException(400, "Order is already fully paid")

    session = stripe.checkout.Session.create(
        line_items=[{
            "price_data": {
                "currency": "usd",
                "unit_amount": int(round(amount * 100)),
                "product_data": {"name": label, "tax_code": "txcd_99999999"},
            },
            "quantity": 1,
        }],
        mode="payment",
        automatic_tax={"enabled": True},
        billing_address_collection="required",
        success_url=f"{req.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{req.origin_url}/payment/cancel?order_id={req.order_id}",
        metadata={"order_id": req.order_id, "plan": req.plan},
    )
    await db.payment_transactions.insert_one({
        "session_id": session.id,
        "order_id": req.order_id,
        "plan": req.plan,
        "amount": amount,
        "currency": "usd",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"checkout_url": session.url, "session_id": session.id}


async def _mark_paid(session_id: str, payment_intent: Optional[str] = None):
    """Idempotent: first caller (webhook or status poll) wins."""
    txn = await db.payment_transactions.find_one_and_update(
        {"session_id": session_id, "payment_status": {"$ne": "paid"}},
        {"$set": {"status": "completed", "payment_status": "paid",
                  "stripe_payment_intent_id": payment_intent,
                  "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if txn:
        order = await db.orders.find_one({"id": txn["order_id"]}, {"_id": 0})
        if order:
            new_paid = float(order.get("paid_amount", 0)) + float(txn["amount"])
            fully = new_paid >= float(order["total_price"]) - 0.01
            await db.orders.update_one(
                {"id": txn["order_id"]},
                {"$set": {"paid_amount": new_paid,
                          "status": "paid_in_full" if fully else "deposit_paid"}},
            )


@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not record:
        raise HTTPException(404, "Transaction not found")
    if record.get("payment_status") != "paid":
        try:
            s = stripe.checkout.Session.retrieve(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                await _mark_paid(session_id, s.payment_intent)
                record = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except stripe.error.StripeError:
            pass
    order = await db.orders.find_one({"id": record["order_id"]}, {"_id": 0})
    return {
        "session_id": record["session_id"],
        "status": record["status"],
        "payment_status": record["payment_status"],
        "order_id": record["order_id"],
        "order_ref": record["order_id"][:8].upper(),
        "build_name": order["build_name"] if order else "",
    }


@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")
    obj, t = event["data"]["object"], event["type"]
    if t == "checkout.session.completed":
        await _mark_paid(obj["id"], obj.get("payment_intent"))
    elif t == "checkout.session.async_payment_succeeded":
        await _mark_paid(obj["id"], obj.get("payment_intent"))
    elif t in ("checkout.session.async_payment_failed",):
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": "failed", "payment_status": "failed",
                      "updated_at": datetime.now(timezone.utc).isoformat()}})
    elif t == "checkout.session.expired":
        await db.payment_transactions.update_one({"session_id": obj["id"]},
            {"$set": {"status": "expired", "payment_status": "expired",
                      "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"status": "ok"}


# ---------- Order tracking ----------

class StatusUpdate(BaseModel):
    status: str


@api_router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, input: StatusUpdate):
    if input.status not in ORDER_STAGES:
        raise HTTPException(400, f"Status must be one of {ORDER_STAGES}")
    res = await db.orders.update_one({"id": order_id}, {"$set": {"status": input.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Order not found")
    return {"id": order_id, "status": input.status}


@api_router.get("/orders/track")
async def track_order(ref: str, email: str):
    if len(ref) < 4:
        raise HTTPException(400, "Enter at least 4 characters of your order reference")
    order = await db.orders.find_one(
        {"id": {"$regex": f"^{ref.lower()}"}, "email": {"$regex": f"^{email.strip()}$", "$options": "i"}},
        {"_id": 0},
    )
    if not order:
        raise HTTPException(404, "No order found with that reference and email")
    current = order["status"]
    stage_index = ORDER_STAGES.index(current) if current in ORDER_STAGES else 0
    if current == "paid_in_full":
        stage_index = max(stage_index, ORDER_STAGES.index("paid_in_full"))
    return {
        "order_ref": order["id"][:8].upper(),
        "build_name": order["build_name"],
        "order_type": order["order_type"],
        "total_price": order["total_price"],
        "paid_amount": order.get("paid_amount", 0),
        "status": current,
        "stage_index": stage_index,
        "created_at": order["created_at"],
    }


# ---------- Routes ----------

@api_router.get("/")
async def root():
    return {"message": "Phoenix PCs API"}


@api_router.get("/catalog")
async def get_catalog():
    return {
        "base_models": BASE_MODELS,
        "components": COMPONENT_OPTIONS,
        "prebuilts": PREBUILTS,
    }


@api_router.post("/orders", response_model=Order)
async def create_order(input: OrderCreate):
    order = Order(**input.model_dump())
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    for o in orders:
        if isinstance(o.get('created_at'), str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
    return orders


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

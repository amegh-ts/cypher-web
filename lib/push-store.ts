const subscriptions: PushSubscription[] = [];

export function addSubscription(sub: PushSubscription) {
  subscriptions.push(sub);
}

export function getSubscriptions(): PushSubscription[] {
  return subscriptions;
}

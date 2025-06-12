export interface PodStatusRaw {
  apiVersion: string
  items: Item[]
  kind: string
  metadata: Metadata2
}

export interface Item {
  apiVersion: string
  kind: string
  metadata: Metadata
  spec: Spec
  status: Status
}

export interface Metadata {
  creationTimestamp: string
  generateName: string
  labels: Labels
  name: string
  namespace: string
  ownerReferences: OwnerReference[]
  resourceVersion: string
  uid: string
}

export interface Labels {
  app: string
  'pod-template-hash': string
  pr: string
}

export interface OwnerReference {
  apiVersion: string
  blockOwnerDeletion: boolean
  controller: boolean
  kind: string
  name: string
  uid: string
}

export interface Spec {
  containers: Container[]
  dnsPolicy: string
  enableServiceLinks: boolean
  imagePullSecrets: ImagePullSecret[]
  nodeName: string
  preemptionPolicy: string
  priority: number
  restartPolicy: string
  schedulerName: string
  securityContext: SecurityContext
  serviceAccount: string
  serviceAccountName: string
  terminationGracePeriodSeconds: number
  tolerations: Toleration[]
  volumes: Volume[]
}

export interface Container {
  envFrom: EnvFrom[]
  image: string
  imagePullPolicy: string
  livenessProbe: LivenessProbe
  name: string
  ports: Port[]
  readinessProbe: ReadinessProbe
  resources: Resources
  terminationMessagePath: string
  terminationMessagePolicy: string
  volumeMounts: VolumeMount[]
}

export interface EnvFrom {
  configMapRef: ConfigMapRef
}

export interface ConfigMapRef {
  name: string
}

export interface LivenessProbe {
  failureThreshold: number
  httpGet: HttpGet
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

export interface HttpGet {
  path: string
  port: number
  scheme: string
}

export interface Port {
  containerPort: number
  protocol: string
}

export interface ReadinessProbe {
  failureThreshold: number
  httpGet: HttpGet2
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

export interface HttpGet2 {
  path: string
  port: number
  scheme: string
}

export interface Resources {}

export interface VolumeMount {
  mountPath: string
  name: string
  readOnly: boolean
}

export interface ImagePullSecret {
  name: string
}

export interface SecurityContext {}

export interface Toleration {
  effect: string
  key: string
  operator: string
  tolerationSeconds: number
}

export interface Volume {
  name: string
  projected: Projected
}

export interface Projected {
  defaultMode: number
  sources: Source[]
}

export interface Source {
  serviceAccountToken?: ServiceAccountToken
  configMap?: ConfigMap
  downwardAPI?: DownwardApi
}

export interface ServiceAccountToken {
  expirationSeconds: number
  path: string
}

export interface ConfigMap {
  items: Item2[]
  name: string
}

export interface Item2 {
  key: string
  path: string
}

export interface DownwardApi {
  items: Item3[]
}

export interface Item3 {
  fieldRef: FieldRef
  path: string
}

export interface FieldRef {
  apiVersion: string
  fieldPath: string
}

export interface Status {
  conditions: Condition[]
  containerStatuses: ContainerStatuse[]
  hostIP: string
  hostIPs: HostIp[]
  phase: string
  podIP: string
  podIPs: PodIp[]
  qosClass: string
  startTime: string
}

export interface Condition {
  lastProbeTime: unknown
  lastTransitionTime: string
  status: string
  type: string
}

export interface ContainerStatuse {
  containerID: string
  image: string
  imageID: string
  lastState: LastState
  name: string
  ready: boolean
  restartCount: number
  started: boolean
  state: State
  volumeMounts: VolumeMount2[]
}

export interface LastState {}

export interface State {
  running: Running
}

export interface Running {
  startedAt: string
}

export interface VolumeMount2 {
  mountPath: string
  name: string
  readOnly: boolean
  recursiveReadOnly: string
}

export interface HostIp {
  ip: string
}

export interface PodIp {
  ip: string
}

export interface Metadata2 {
  resourceVersion: string
}

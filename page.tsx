          {/* Recent vendors and activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">Recent Vendors</CardTitle>
                <Button variant="link" size="sm" className="text-blue-600 font-medium">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 bg-gray-100">
                          <AvatarImage src={vendor.logo || "/placeholder.svg"} alt={vendor.name} />
                          <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <p className="text-sm text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            vendor.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          } rounded-md px-2 py-0.5 text-xs font-medium`}
                        >
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm" className="text-sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
                <Button variant="link" size="sm" className="text-blue-600 font-medium">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3"
                    >
                      <div className="mt-0.5">{activity.icon}</div>
                      <div className="flex-1">
                        <p className="text-gray-900">
                          {activity.type === "contract_signed" && "New contract signed with "}
                          {activity.type === "document_submitted" && "Vendor "}
                          {activity.type === "contract_expiring" && "Contract with "}
                          {activity.type === "rating_received" && ""}
                          <span className="font-medium">{activity.vendor}</span>
                          {activity.type === "document_submitted" && " submitted documents for review"}
                          {activity.type === "contract_expiring" && ` ${activity.details}`}
                          {activity.type === "rating_received" && " received a 5-star rating"}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top rated vendors */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold">Top Rated Vendors</CardTitle>
              <Button variant="link" size="sm" className="text-blue-600 font-medium">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topRatedVendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <Avatar className="h-12 w-12 bg-gray-100">
                        <AvatarImage src={vendor.logo || "/placeholder.svg"} alt={vendor.name} />
                        <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <Badge
                        className={`${
                          vendor.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        } rounded-md px-2 py-0.5 text-xs font-medium`}
                      >
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{vendor.category}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(vendor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {vendor.contracts} {vendor.contracts === 1 ? "contract" : "contracts"}
                      </span>
                      <Button variant="outline" size="sm" className="text-sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> 